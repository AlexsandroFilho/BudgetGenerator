import { Budget } from './Budget';

export class BudgetItem {
  constructor(
    public id: string,
    public budgetId: string,
    public descricao: string,
    public quantidade: number,
    public valor_unitario: number,
    public category: string,
    public unidade: string = 'un',
    public budget?: Budget
  ) {}
}
