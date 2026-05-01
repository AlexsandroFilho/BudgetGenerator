import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { Budget } from '../../domain/entities/Budget';

export interface GetBudgetByIdDTO {
  id: string;
  userId: string;
}

export class GetBudgetByIdUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(data: GetBudgetByIdDTO): Promise<Budget> {
    const budget = await this.budgetRepository.findById(data.id);

    if (!budget) {
      throw new Error('Orçamento não encontrado.');
    }

    if (budget.userId !== data.userId) {
      throw new Error('Acesso negado: este orçamento não pertence ao seu usuário.');
    }

    return budget;
  }
}
