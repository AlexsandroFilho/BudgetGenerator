import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';

export interface DeleteBudgetDTO {
  id: string;
  userId: string;
}

export class DeleteBudgetUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(data: DeleteBudgetDTO): Promise<void> {
    const budget = await this.budgetRepository.findById(data.id);

    if (!budget) {
      throw new Error('Orçamento não encontrado.');
    }

    if (budget.userId !== data.userId) {
      throw new Error('Acesso negado: este orçamento não pertence ao seu usuário.');
    }

    await this.budgetRepository.delete(data.id);
  }
}
