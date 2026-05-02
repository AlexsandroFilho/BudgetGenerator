import axios from 'axios';
import * as cheerio from 'cheerio';

export interface PartPrice {
  site: string;
  price: number;
  title: string;
}

export interface PartResearch {
  partName: string;
  searchQuery: string;
  cheapest: PartPrice[];
  average: number;
}

export class PriceResearchService {
  private readonly headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };

  async researchPart(partName: string, searchQuery: string): Promise<PartResearch> {
    const results = await Promise.allSettled([
      this.searchMercadoLivre(searchQuery),
      this.searchKabum(searchQuery),
      this.searchPichau(searchQuery),
      this.searchTerabyte(searchQuery),
    ]);

    const allPrices: PartPrice[] = [];
    results.forEach(r => {
      if (r.status === 'fulfilled') allPrices.push(...r.value);
    });

    if (allPrices.length === 0) {
      return { partName, searchQuery, cheapest: [], average: 0 };
    }

    const sorted = allPrices.sort((a, b) => a.price - b.price);
    const cheapest = sorted.slice(0, 3);
    const average = Math.round((cheapest.reduce((s, p) => s + p.price, 0) / cheapest.length) * 100) / 100;

    return { partName, searchQuery, cheapest, average };
  }

  async researchMany(parts: { name: string; searchQuery: string }[]): Promise<PartResearch[]> {
    return Promise.all(parts.map(p => this.researchPart(p.name, p.searchQuery)));
  }

  private async searchMercadoLivre(query: string): Promise<PartPrice[]> {
    try {
      const res = await axios.get(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=5`,
        { timeout: 8000 }
      );
      return (res.data.results || [])
        .filter((item: any) => item.price > 0)
        .slice(0, 3)
        .map((item: any) => ({ site: 'Mercado Livre', price: item.price, title: item.title }));
    } catch {
      return [];
    }
  }

  private async searchKabum(query: string): Promise<PartPrice[]> {
    try {
      const url = `https://www.kabum.com.br/busca/${encodeURIComponent(query)}`;
      const res = await axios.get(url, { headers: this.headers, timeout: 8000 });
      return this.extractPricesFromHtml(res.data, 'KaBuM', query);
    } catch {
      return [];
    }
  }

  private async searchPichau(query: string): Promise<PartPrice[]> {
    try {
      const url = `https://www.pichau.com.br/search?q=${encodeURIComponent(query)}`;
      const res = await axios.get(url, { headers: this.headers, timeout: 8000 });
      return this.extractPricesFromHtml(res.data, 'Pichau', query);
    } catch {
      return [];
    }
  }

  private async searchTerabyte(query: string): Promise<PartPrice[]> {
    try {
      const url = `https://www.terabyteshop.com.br/busca?str=${encodeURIComponent(query)}`;
      const res = await axios.get(url, { headers: this.headers, timeout: 8000 });
      return this.extractPricesFromHtml(res.data, 'TerabyteShop', query);
    } catch {
      return [];
    }
  }

  // Extrai preços do HTML usando regex — robusto a mudanças de layout
  private extractPricesFromHtml(html: string, site: string, query: string): PartPrice[] {
    const $ = cheerio.load(html);
    const prices: PartPrice[] = [];

    // Remove scripts e styles do DOM antes de buscar texto
    $('script, style, noscript').remove();

    // Regex para capturar padrões "R$ 1.234,56" ou "1.234,56"
    const priceRegex = /R\$\s*([\d]{1,3}(?:\.[\d]{3})*(?:,[\d]{2})?)/g;
    const bodyText = $.html();

    let match;
    const found: number[] = [];

    while ((match = priceRegex.exec(bodyText)) !== null && found.length < 5) {
      const raw = match[1].replace(/\./g, '').replace(',', '.');
      const value = parseFloat(raw);
      // Filtra valores irreais (< R$10 ou > R$50.000)
      if (!isNaN(value) && value >= 10 && value <= 50000) {
        found.push(value);
      }
    }

    // Pega os 3 menores valores encontrados na página
    const top3 = [...new Set(found)].sort((a, b) => a - b).slice(0, 3);
    top3.forEach(price => prices.push({ site, price, title: query }));

    return prices;
  }
}
