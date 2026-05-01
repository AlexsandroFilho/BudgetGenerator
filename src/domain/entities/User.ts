import { Budget } from './Budget';

export class User {
  constructor(
    public id: string,
    public nome: string,
    public email: string,
    public senha?: string,
    public telefone?: string,
    public avatarUrl?: string,
    public budgets?: Budget[]
  ) {}
}
