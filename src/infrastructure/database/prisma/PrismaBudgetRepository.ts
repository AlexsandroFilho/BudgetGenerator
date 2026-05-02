// Trigger restart to load new Prisma client
import { IBudgetRepository } from '../../../domain/repositories/IBudgetRepository';
import { Budget, BudgetTipo, BudgetCategoria, BudgetStatus } from '../../../domain/entities/Budget';
import { BudgetItem } from '../../../domain/entities/BudgetItem';
import { prisma } from './prismaClient';

export class PrismaBudgetRepository implements IBudgetRepository {
  async save(budget: Budget): Promise<void> {
    await prisma.budget.upsert({
      where: { id: budget.id },
      update: {
        userId: budget.userId,
        tipo: budget.tipo as any,
        categoria: budget.categoria as any,
        descricao_cliente: budget.descricao_cliente,
        title: budget.title,
        technical_description: budget.technical_description,
        total_estimado: budget.total_estimado,
        status: budget.status as any,
        criado_em: budget.criado_em,
        cliente_nome: budget.cliente_nome,
        prestador_nome: budget.prestador_nome,
      },
      create: {
        id: budget.id,
        userId: budget.userId,
        tipo: budget.tipo as any,
        categoria: budget.categoria as any,
        descricao_cliente: budget.descricao_cliente,
        title: budget.title,
        technical_description: budget.technical_description,
        total_estimado: budget.total_estimado,
        status: budget.status as any,
        criado_em: budget.criado_em,
        cliente_nome: budget.cliente_nome,
        prestador_nome: budget.prestador_nome,
      },
    });

    // Se houver itens associados, salvar ou atualizar cada um deles
    if (budget.items && budget.items.length > 0) {
      for (const item of budget.items) {
        await prisma.budgetItem.upsert({
          where: { id: item.id },
          update: {
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valor_unitario: item.valor_unitario,
            category: item.category,
          },
          create: {
            id: item.id,
            budgetId: budget.id,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valor_unitario: item.valor_unitario,
            category: item.category,
          },
        });
      }
    }
  }

  async findById(id: string): Promise<Budget | null> {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!budget) return null;

    const items = budget.items.map(
      (item) => new BudgetItem(item.id, item.budgetId, item.descricao, item.quantidade, item.valor_unitario.toNumber(), item.category, item.unidade)
    );

    return new Budget(
      budget.id,
      budget.userId,
      budget.tipo as unknown as BudgetTipo,
      budget.categoria as unknown as BudgetCategoria,
      budget.descricao_cliente,
      budget.total_estimado.toNumber(),
      budget.status as unknown as BudgetStatus,
      budget.criado_em,
      budget.title ?? undefined,
      budget.technical_description ?? undefined,
      items,
      undefined,
      budget.cliente_nome ?? undefined,
      budget.prestador_nome ?? undefined
    );
  }

  async findAllByUserId(userId: string): Promise<Budget[]> {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { items: true },
    });

    return budgets.map((budget) => {
      const items = budget.items.map(
        (item) => new BudgetItem(item.id, item.budgetId, item.descricao, item.quantidade, item.valor_unitario.toNumber(), item.category, item.unidade)
      );

      return new Budget(
        budget.id,
        budget.userId,
        budget.tipo as unknown as BudgetTipo,
        budget.categoria as unknown as BudgetCategoria,
        budget.descricao_cliente,
        budget.total_estimado.toNumber(),
        budget.status as unknown as BudgetStatus,
        budget.criado_em,
        budget.title ?? undefined,
        budget.technical_description ?? undefined,
        items,
        undefined,
        budget.cliente_nome ?? undefined,
        budget.prestador_nome ?? undefined
      );
    });
  }

  async update(id: string, data: Partial<Budget>): Promise<Budget> {
    // Usar transação para garantir que o orçamento e seus itens sejam atualizados de forma atômica
    return await prisma.$transaction(async (tx) => {
      // 1. Atualizar campos principais do orçamento
      const updatedBudget = await tx.budget.update({
        where: { id },
        data: {
          title: data.title,
          technical_description: data.technical_description,
          status: data.status as any,
          total_estimado: data.total_estimado,
        },
        include: { items: true },
      });

      // 2. Se houver itens na atualização, sincronizá-los (upsert)
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await tx.budgetItem.upsert({
            where: { id: item.id },
            update: {
              descricao: item.descricao,
              quantidade: item.quantidade,
              unidade: item.unidade,
              valor_unitario: item.valor_unitario,
              category: item.category,
            },
            create: {
              id: item.id || undefined, // UUID gerado pelo banco se não houver
              budgetId: id,
              descricao: item.descricao,
              quantidade: item.quantidade,
              unidade: item.unidade,
              valor_unitario: item.valor_unitario,
              category: item.category,
            },
          });
        }
      }

      // Buscar novamente para retornar os dados completos e sincronizados
      const fullBudget = await tx.budget.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!fullBudget) throw new Error('Falha ao recuperar o orçamento atualizado.');

      const mappedItems = fullBudget.items.map(
        (item) => new BudgetItem(item.id, item.budgetId, item.descricao, item.quantidade, item.valor_unitario.toNumber(), item.category, item.unidade)
      );

      return new Budget(
        fullBudget.id,
        fullBudget.userId,
        fullBudget.tipo as unknown as BudgetTipo,
        fullBudget.categoria as unknown as BudgetCategoria,
        fullBudget.descricao_cliente,
        fullBudget.total_estimado.toNumber(),
        fullBudget.status as unknown as BudgetStatus,
        fullBudget.criado_em,
        fullBudget.title ?? undefined,
        fullBudget.technical_description ?? undefined,
        mappedItems
      );
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.budget.delete({
      where: { id },
    });
  }
}
