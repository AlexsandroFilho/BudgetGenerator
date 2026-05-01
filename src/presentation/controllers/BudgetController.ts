import { Response, NextFunction } from 'express';
import { GenerateBudgetUseCase } from '../../application/use-cases/GenerateBudgetUseCase';
import { ListUserBudgetsUseCase } from '../../application/use-cases/ListUserBudgetsUseCase';
import { GetBudgetByIdUseCase } from '../../application/use-cases/GetBudgetByIdUseCase';
import { DeleteBudgetUseCase } from '../../application/use-cases/DeleteBudgetUseCase';
import { UpdateBudgetUseCase } from '../../application/use-cases/UpdateBudgetUseCase';
import { GetBudgetStatsUseCase } from '../../application/use-cases/GetBudgetStatsUseCase';
import { AppError } from '../../domain/errors/AppError';
import { AuthenticatedRequest } from '../protocols/http';

export class BudgetController {
  constructor(
    private readonly generateBudgetUseCase: GenerateBudgetUseCase,
    private readonly listUserBudgetsUseCase: ListUserBudgetsUseCase,
    private readonly getBudgetByIdUseCase: GetBudgetByIdUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase,
    private readonly updateBudgetUseCase: UpdateBudgetUseCase,
    private readonly getBudgetStatsUseCase: GetBudgetStatsUseCase
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const { tipo, categoria, descricao_cliente } = req.body;

      if (!tipo || !categoria || !descricao_cliente) {
        throw new AppError('Todos os campos são obrigatórios: tipo, categoria, descricao_cliente.');
      }

      const budget = await this.generateBudgetUseCase.execute({
        userId,
        tipo,
        categoria,
        descricao_cliente
      });

      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  }

  async index(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const budgets = await this.listUserBudgetsUseCase.execute(userId);
      
      // Mapeamento para os campos solicitados + campos necessários para a UI
      const mappedBudgets = budgets.map(b => ({
        id: b.id,
        tipo: b.tipo,
        categoria: b.categoria,
        title: b.title,
        technical_description: b.technical_description,
        total_estimado: b.total_estimado,
        descricao_cliente: b.descricao_cliente, // Necessário para a Landing Page
        status: b.status,                       // Necessário para a Landing Page
        criado_em: b.criado_em,                 // Necessário para a Landing Page
        items: b.items                          // Incluindo items para o modal
      }));

      res.status(200).json(mappedBudgets);
    } catch (error) {
      next(error);
    }
  }

  async show(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const id = String(req.params.id);
      const budget = await this.getBudgetByIdUseCase.execute({ id, userId });
      res.status(200).json(budget);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const id = String(req.params.id);
      const { title, technical_description, status, total_estimado, items } = req.body;

      const budget = await this.updateBudgetUseCase.execute({
        id,
        userId,
        title,
        technical_description,
        status,
        total_estimado,
        items
      });

      // Mapear resposta com todos os campos necessários
      res.status(200).json({
        id: budget.id,
        userId: budget.userId,
        tipo: budget.tipo,
        categoria: budget.categoria,
        title: budget.title,
        technical_description: budget.technical_description,
        total_estimado: budget.total_estimado,
        descricao_cliente: budget.descricao_cliente,
        status: budget.status,
        criado_em: budget.criado_em,
        items: budget.items || []
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const id = String(req.params.id);
      await this.deleteBudgetUseCase.execute({ id, userId });
      
      // Retorna 204 No Content em caso de sucesso
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: userId } = req.user;
      const stats = await this.getBudgetStatsUseCase.execute(userId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
