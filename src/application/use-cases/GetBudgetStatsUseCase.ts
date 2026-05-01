import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { BudgetTipo, BudgetCategoria } from '../../domain/entities/Budget';

export interface BudgetStatsResponse {
  byCategory: {
    UPGRADE: number;
    REPARO: number;
    MANUTENCAO: number;
  };
  byType: {
    HARDWARE: number;
    SOFTWARE: number;
  };
  totalCount: number;
  totalValue: number;
}

export class GetBudgetStatsUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(userId: string): Promise<BudgetStatsResponse> {
    const budgets = await this.budgetRepository.findAllByUserId(userId);

    const stats: BudgetStatsResponse = {
      byCategory: {
        UPGRADE: 0,
        REPARO: 0,
        MANUTENCAO: 0,
      },
      byType: {
        HARDWARE: 0,
        SOFTWARE: 0,
      },
      totalCount: budgets.length,
      totalValue: 0,
    };

    budgets.forEach((budget) => {
      // Agregação por Categoria
      if (budget.categoria === BudgetCategoria.UPGRADE) stats.byCategory.UPGRADE++;
      else if (budget.categoria === BudgetCategoria.REPARO) stats.byCategory.REPARO++;
      else if (budget.categoria === BudgetCategoria.MANUTENCAO) stats.byCategory.MANUTENCAO++;

      // Agregação por Tipo
      if (budget.tipo === BudgetTipo.HARDWARE) stats.byType.HARDWARE++;
      else if (budget.tipo === BudgetTipo.SOFTWARE) stats.byType.SOFTWARE++;

      // Soma do valor total
      stats.totalValue += Number(budget.total_estimado);
    });

    return stats;
  }
}
