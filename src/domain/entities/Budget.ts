import { BudgetItem } from './BudgetItem';
import { User } from './User';

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

export class Budget {
  constructor(
    public id: string,
    public userId: string,
    public tipo: BudgetTipo,
    public categoria: BudgetCategoria,
    public descricao_cliente: string,
    public total_estimado: number,
    public status: BudgetStatus,
    public criado_em: Date,
    public title?: string,
    public technical_description?: string,
    public items?: BudgetItem[],
    public user?: User,
    public cliente_nome?: string,
    public prestador_nome?: string
  ) {}
}
