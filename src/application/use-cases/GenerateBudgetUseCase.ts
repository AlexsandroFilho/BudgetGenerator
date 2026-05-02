import { randomUUID } from 'crypto';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { IBudgetGenerator } from '../../domain/interfaces/IBudgetGenerator';
import { PriceResearchService } from '../../infrastructure/external-services/PriceResearchService';
import { Budget, BudgetTipo, BudgetCategoria, BudgetStatus } from '../../domain/entities/Budget';
import { BudgetItem } from '../../domain/entities/BudgetItem';

export interface GenerateBudgetDTO {
  userId: string;
  tipo: BudgetTipo;
  categoria: BudgetCategoria;
  descricao_cliente: string;
  showPartsDetail: boolean;
  cliente_nome?: string;
  prestador_nome?: string;
}

export class GenerateBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly budgetGenerator: IBudgetGenerator,
    private readonly priceResearchService: PriceResearchService
  ) {}

  async execute(data: GenerateBudgetDTO): Promise<Budget> {
    const mappedTipo = data.tipo === BudgetTipo.SOFTWARE ? 'Software' : 'Hardware';

    let mappedCategoria: 'Upgrade' | 'Reparo' | 'Manutencao';
    switch (data.categoria) {
      case BudgetCategoria.UPGRADE:    mappedCategoria = 'Upgrade';    break;
      case BudgetCategoria.REPARO:     mappedCategoria = 'Reparo';     break;
      case BudgetCategoria.MANUTENCAO:
      default:                         mappedCategoria = 'Manutencao'; break;
    }

    // 1. Gemini analisa se o serviço precisa de peças físicas
    const analysis = await this.budgetGenerator.analyzePartsNeeded(
      data.descricao_cliente,
      mappedTipo,
      mappedCategoria
    );

    // 2. Se precisar de peças, pesquisa preços reais nos sites
    let partsResearch = undefined;
    if (analysis.needs_parts && analysis.parts.length > 0) {
      console.log(`🔍 Pesquisando preços para ${analysis.parts.length} peça(s)...`);
      partsResearch = await this.priceResearchService.researchMany(analysis.parts);
      partsResearch.forEach(p => {
        if (p.average > 0) {
          console.log(`  ✅ ${p.partName}: média R$${p.average.toFixed(2)} (${p.cheapest.map(c => c.site).join(', ')})`);
        } else {
          console.log(`  ⚠️  ${p.partName}: nenhum preço encontrado, Gemini usará estimativa interna`);
        }
      });
    }

    // 3. Gemini gera o orçamento completo com contexto de preços reais
    const generatedResult = await this.budgetGenerator.generate({
      tipo: mappedTipo,
      categoria: mappedCategoria,
      descricao_cliente: data.descricao_cliente,
      showPartsDetail: data.showPartsDetail,
      partsResearch,
    });

    // 4. Monta as entidades e salva
    const budgetId = randomUUID();
    const newBudget = new Budget(
      budgetId,
      data.userId,
      data.tipo,
      data.categoria,
      data.descricao_cliente,
      generatedResult.total_estimado,
      BudgetStatus.GERADO,
      new Date(),
      generatedResult.title,
      generatedResult.technical_description,
      [],
      undefined,
      data.cliente_nome || undefined,
      data.prestador_nome || undefined
    );

    const budgetItems: BudgetItem[] = generatedResult.items.map(item =>
      new BudgetItem(
        randomUUID(),
        budgetId,
        item.descricao,
        item.quantidade,
        item.valor_unitario,
        item.category,
        item.unidade || 'un'
      )
    );

    newBudget.items = budgetItems;
    await this.budgetRepository.save(newBudget);

    return newBudget;
  }
}
