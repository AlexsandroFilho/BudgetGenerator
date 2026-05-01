export interface BudgetParams {
  tipo: 'Software' | 'Hardware';
  categoria: 'Upgrade' | 'Reparo' | 'Manutencao';
  descricao_cliente: string;
}

export interface BudgetItemOutput {
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  category: string;
}

export interface BudgetOutput {
  title: string;
  technical_description: string;
  total_estimado: number;
  items: BudgetItemOutput[];
}

export interface IBudgetGenerator {
  generate(params: BudgetParams): Promise<BudgetOutput>;
}
