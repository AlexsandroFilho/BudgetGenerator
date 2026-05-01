import { randomUUID } from 'crypto';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { IBudgetGenerator } from '../../domain/interfaces/IBudgetGenerator';
import { Budget, BudgetTipo, BudgetCategoria, BudgetStatus } from '../../domain/entities/Budget';
import { BudgetItem } from '../../domain/entities/BudgetItem';

export interface GenerateBudgetDTO {
  userId: string;
  tipo: BudgetTipo;
  categoria: BudgetCategoria;
  descricao_cliente: string;
}

export class GenerateBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly budgetGenerator: IBudgetGenerator
  ) {}

  async execute(data: GenerateBudgetDTO): Promise<Budget> {
    // Mapeamento dos enums para os tipos literais esperados pela interface IBudgetGenerator
    const mappedTipo = data.tipo === BudgetTipo.SOFTWARE ? 'Software' : 'Hardware';
    
    let mappedCategoria: 'Upgrade' | 'Reparo' | 'Manutencao';
    switch (data.categoria) {
      case BudgetCategoria.UPGRADE:
        mappedCategoria = 'Upgrade';
        break;
      case BudgetCategoria.REPARO:
        mappedCategoria = 'Reparo';
        break;
      case BudgetCategoria.MANUTENCAO:
      default:
        mappedCategoria = 'Manutencao';
        break;
    }

    // 1. Chamar o serviço do Gemini para gerar os valores
    const generatedResult = await this.budgetGenerator.generate({
      tipo: mappedTipo,
      categoria: mappedCategoria,
      descricao_cliente: data.descricao_cliente
    });

    // 2. Instanciar a entidade Budget
    const budgetId = randomUUID();
    const newBudget = new Budget(
      budgetId,
      data.userId,
      data.tipo,
      data.categoria,
      data.descricao_cliente,
      generatedResult.total_estimado,
      BudgetStatus.GERADO, // O orçamento começa com status 'GERADO'
      new Date(),
      generatedResult.title,
      generatedResult.technical_description,
      [] // items ficam vazios no momento de construir o pai, mas inserimos logo em seguida
    );

    // 3. Instanciar as entidades BudgetItem
    const budgetItems: BudgetItem[] = generatedResult.items.map((item) => {
      return new BudgetItem(
        randomUUID(),
        budgetId,
        item.descricao,
        item.quantidade,
        item.valor_unitario,
        item.category
      );
    });

    newBudget.items = budgetItems;

    // 4. Salvar tudo no banco de dados via repositório
    await this.budgetRepository.save(newBudget);

    // 5. Retornar a entidade salva completa
    return newBudget;
  }
}
