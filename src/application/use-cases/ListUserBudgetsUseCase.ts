import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { Budget } from '../../domain/entities/Budget';

export class ListUserBudgetsUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(userId: string): Promise<Budget[]> {
    return await this.budgetRepository.findAllByUserId(userId);
  }
}
