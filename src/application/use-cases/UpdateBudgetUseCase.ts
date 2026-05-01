import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';
import { Budget } from '../../domain/entities/Budget';
import { AppError } from '../../domain/errors/AppError';

interface UpdateBudgetDTO {
  id: string;
  userId: string;
  title?: string;
  technical_description?: string;
  status?: any;
  total_estimado?: number;
  items?: any[];
}

export class UpdateBudgetUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(data: UpdateBudgetDTO): Promise<Budget> {
    // Validação: ID obrigatório
    if (!data.id) {
      throw new AppError('ID do orçamento é obrigatório.', 400);
    }

    // Validação: userId obrigatório
    if (!data.userId) {
      throw new AppError('Usuário não identificado.', 401);
    }

    // Verificar se o orçamento existe
    const budget = await this.budgetRepository.findById(data.id);

    if (!budget) {
      throw new AppError('Orçamento não encontrado.', 404);
    }

    // Validação de permissão: apenas o proprietário pode atualizar
    if (budget.userId !== data.userId) {
      throw new AppError('Você não tem permissão para atualizar este orçamento.', 403);
    }

    // Validação: title deve ter no mínimo 5 caracteres se fornecido
    if (data.title && data.title.trim().length < 5) {
      throw new AppError('Título deve ter no mínimo 5 caracteres.', 400);
    }

    // Validação: technical_description deve ter no mínimo 15 caracteres se fornecido
    if (data.technical_description && data.technical_description.trim().length < 15) {
      throw new AppError('Descrição técnica deve ter no mínimo 15 caracteres.', 400);
    }

    // Validação: total_estimado deve ser > 0 se fornecido
    if (data.total_estimado !== undefined && data.total_estimado <= 0) {
      throw new AppError('Total estimado deve ser maior que 0.', 400);
    }

    // Executar atualização com tratamento de items
    const updatedBudget = await this.budgetRepository.update(data.id, {
      title: data.title?.trim(),
      technical_description: data.technical_description?.trim(),
      status: data.status,
      total_estimado: data.total_estimado,
      items: data.items
    });

    return updatedBudget;
  }
}

