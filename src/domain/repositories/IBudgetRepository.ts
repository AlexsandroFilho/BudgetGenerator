import { Budget } from '../entities/Budget';

export interface IBudgetRepository {
  save(budget: Budget): Promise<void>;
  findById(id: string): Promise<Budget | null>;
  findAllByUserId(userId: string): Promise<Budget[]>;
  update(id: string, data: Partial<Budget>): Promise<Budget>;
  delete(id: string): Promise<void>;
}
