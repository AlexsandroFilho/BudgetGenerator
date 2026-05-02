import { GoogleGenerativeAI } from '@google/generative-ai';
import { IBudgetGenerator, BudgetParams, BudgetOutput, PartsAnalysis } from '../../domain/interfaces/IBudgetGenerator';
import { PartResearch } from './PriceResearchService';

export class GeminiBudgetService implements IBudgetGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('A API Key do Gemini (GEMINI_API_KEY) não está definida nas variáveis de ambiente.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  // --- CHAMADA 1: Analisa se o serviço precisa de peças físicas ---
  async analyzePartsNeeded(descricao: string, tipo: string, categoria: string): Promise<PartsAnalysis> {
    const prompt = `Você é um técnico de TI experiente. Analise a solicitação abaixo e determine se ela exige a COMPRA de peças físicas (hardware, componentes, cabos, etc.) pelo prestador de serviço para execução.

Solicitação:
- Tipo: ${tipo}
- Categoria: ${categoria}
- Descrição: "${descricao}"

REGRAS:
- Se o cliente mencionou que JÁ TEM a peça (ex: "memória já comprada"), needs_parts = false
- Serviços puramente de mão de obra (limpeza, configuração, formatação, instalação de software) = needs_parts = false
- Se precisar comprar peças, liste-as com queries de busca em português para lojas brasileiras (ex: "memória ram 8gb ddr4")

Retorne SOMENTE JSON válido:
{
  "needs_parts": true,
  "parts": [
    { "name": "Nome da peça", "searchQuery": "query de busca para loja" }
  ]
}

Se needs_parts for false, retorne parts como array vazio.`;

    try {
      const result = await this.callWithRetry(prompt);
      return this.parseAnalysis(result);
    } catch {
      return { needs_parts: false, parts: [] };
    }
  }

  // --- CHAMADA 2: Gera o orçamento completo com contexto de preços ---
  async generate(params: BudgetParams): Promise<BudgetOutput> {
    const { tipo, categoria, descricao_cliente, showPartsDetail, partsResearch } = params;

    const partsContext = this.buildPartsContext(partsResearch, showPartsDetail);

    const prompt = `Você é um Consultor de TI Sênior gerando uma proposta comercial profissional.

Solicitação do cliente:
- Tipo: ${tipo}
- Categoria: ${categoria}
- Descrição: "${descricao_cliente}"

${partsContext}

INSTRUÇÕES DE FORMATAÇÃO DOS ITENS:
${showPartsDetail && partsResearch && partsResearch.length > 0
  ? `- OBRIGATÓRIO: inclua cada peça pesquisada como um item separado com category "Peça", usando o preço médio fornecido acima
- Inclua a mão de obra de instalação/execução como itens separados com category "Serviço"
- O total_estimado deve ser a soma de TODOS os itens (peças + serviços)`
  : `- Liste os serviços executados como itens de mão de obra com category "Serviço"
- Se houver peças necessárias, inclua-as de forma agrupada com descrição genérica na category "Peça"
- O total_estimado deve ser a soma de todos os itens`}

INSTRUÇÕES CRÍTICAS:
1. Retorne SOMENTE JSON válido, sem texto adicional
2. NÃO use blocos markdown
3. NUNCA quebre linhas dentro de strings
4. Strings com aspas duplas, números como valores numéricos
5. A unidade deve ser "un", "hrs", "m" ou "kit" conforme o item

Estrutura obrigatória:
{
  "title": "Título comercial do serviço",
  "technical_description": "Descrição técnica em UMA frase objetiva",
  "total_estimado": 0,
  "items": [
    {
      "descricao": "Descrição do item",
      "quantidade": 1,
      "unidade": "un",
      "valor_unitario": 0,
      "category": "Serviço"
    }
  ]
}`;

    try {
      const text = await this.callWithRetry(prompt);
      return this.parseResponse(text);
    } catch (error) {
      throw new Error(`Falha ao comunicar com a API do Gemini: ${(error as Error).message}`);
    }
  }

  private async callWithRetry(prompt: string, maxRetries = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        const msg = (error as Error).message || '';
        const is503 = msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('high demand');
        if (is503 && attempt < maxRetries) {
          const delay = attempt * 3000;
          console.log(`⚠️  Gemini 503 — tentativa ${attempt}/${maxRetries}, aguardando ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Gemini indisponível após múltiplas tentativas. Tente novamente em alguns instantes.');
  }

  private buildPartsContext(partsResearch: PartResearch[] | undefined, showPartsDetail: boolean): string {
    if (!partsResearch || partsResearch.length === 0) return '';

    const lines = partsResearch.map(p => {
      if (p.average === 0) {
        return `- ${p.partName}: preço não encontrado, use estimativa de mercado`;
      }
      const sitesInfo = p.cheapest.map(c => `${c.site}: R$${c.price.toFixed(2)}`).join(', ');
      return `- ${p.partName}: média R$${p.average.toFixed(2)} (encontrado em: ${sitesInfo})`;
    });

    const label = showPartsDetail
      ? 'PREÇOS REAIS PESQUISADOS (liste cada peça separada no orçamento com esses valores):'
      : 'REFERÊNCIA DE PREÇOS (use para compor o valor total, sem detalhar por peça):';

    return `\n${label}\n${lines.join('\n')}\n`;
  }

  private parseAnalysis(text: string): PartsAnalysis {
    try {
      let clean = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) clean = match[0];
      const parsed = JSON.parse(clean);
      return {
        needs_parts: Boolean(parsed.needs_parts),
        parts: Array.isArray(parsed.parts) ? parsed.parts : [],
      };
    } catch {
      return { needs_parts: false, parts: [] };
    }
  }

  private parseResponse(text: string): BudgetOutput {
    try {
      let clean = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) clean = match[0];
      clean = clean.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');

      const parsed = JSON.parse(clean);

      if (
        !parsed ||
        typeof parsed.title !== 'string' ||
        typeof parsed.technical_description !== 'string' ||
        typeof parsed.total_estimado !== 'number' ||
        !Array.isArray(parsed.items) ||
        parsed.items.length === 0
      ) {
        throw new Error('Estrutura JSON inválida ou incompleta retornada pelo Gemini.');
      }

      parsed.items.forEach((item: any, i: number) => {
        if (typeof item.descricao !== 'string' || typeof item.quantidade !== 'number' || typeof item.valor_unitario !== 'number') {
          throw new Error(`Item [${i}] com campos inválidos.`);
        }
        item.quantidade = Math.max(1, Math.round(item.quantidade));
        item.unidade = item.unidade || 'un';
        if (item.valor_unitario <= 0) throw new Error(`Item [${i}]: valor_unitario deve ser > 0`);
      });

      if (parsed.total_estimado <= 0) throw new Error('total_estimado deve ser > 0');

      return parsed as BudgetOutput;
    } catch (error) {
      throw new Error(`Falha ao processar resposta do Gemini: ${(error as Error).message}`);
    }
  }
}
