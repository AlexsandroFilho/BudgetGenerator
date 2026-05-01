export enum BudgetTipo {
  SOFTWARE = 'SOFTWARE',
  HARDWARE = 'HARDWARE'
}

export enum BudgetCategoria {
  UPGRADE = 'UPGRADE',
  REPARO = 'REPARO',
  MANUTENCAO = 'MANUTENCAO'
}

export enum BudgetStatus {
  PENDENTE = 'PENDENTE',
  GERADO = 'GERADO'
}

export interface BudgetItem {
  id: string;
  descricao: string;
  quantidade: number;
  unidade?: string;
  valor_unitario: number;
  category: string;
}

export interface Budget {
  id: string;
  userId: string;
  tipo: BudgetTipo;
  categoria: BudgetCategoria;
  descricao_cliente: string;
  total_estimado: number;
  status: BudgetStatus;
  title?: string;
  technical_description?: string;
  criado_em: Date;
  items?: BudgetItem[];
}
