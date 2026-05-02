import { PartResearch } from '../../infrastructure/external-services/PriceResearchService';

export interface BudgetParams {
  tipo: 'Software' | 'Hardware';
  categoria: 'Upgrade' | 'Reparo' | 'Manutencao';
  descricao_cliente: string;
  showPartsDetail: boolean;
  partsResearch?: PartResearch[];
}

export interface PartsAnalysis {
  needs_parts: boolean;
  parts: { name: string; searchQuery: string }[];
}

export interface BudgetItemOutput {
  descricao: string;
  quantidade: number;
  unidade: string;
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
  analyzePartsNeeded(descricao: string, tipo: string, categoria: string): Promise<PartsAnalysis>;
  generate(params: BudgetParams): Promise<BudgetOutput>;
}
