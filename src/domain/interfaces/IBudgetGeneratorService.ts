export type BudgetOption = 'upgrade' | 'reparo' | 'manutenção';

export interface UserDetails {
  nome: string;
  email: string;
}

export interface BudgetRequest {
  opcao: BudgetOption;
  detalhesUsuario: UserDetails;
  observacoes?: string;
}

export interface BudgetItem {
  descricao: string;
  valorEstimado: number; // Em BRL
}

export interface BudgetResponse {
  itens: BudgetItem[];
  totalEstimado: number;
}

export interface IBudgetGeneratorService {
  generateBudget(request: BudgetRequest): Promise<BudgetResponse>;
}
