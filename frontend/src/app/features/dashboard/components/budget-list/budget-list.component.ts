import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from '../../../../core/services/budget.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Budget, BudgetStatus } from '../../../../core/models/budget.model';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  budgets = signal<Budget[]>([]);
  isLoading = signal(false);
  expandedBudgetId = signal<string | null>(null);
  showCreateModal = signal(false);
  isCreating = signal(false);

  // Form fields for creating new budget
  formData = signal({
    tipo: '',
    categoria: '',
    descricao_cliente: '',
    showPartsDetail: false
  });

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.isLoading.set(true);
    this.budgetService.getBudgets().subscribe({
      next: (data: Budget[]) => {
        this.budgets.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.toastService.error('Erro ao carregar orçamentos');
        console.error(err);
      }
    });
  }

  toggleExpandBudget(budgetId: string): void {
    if (this.expandedBudgetId() === budgetId) {
      this.expandedBudgetId.set(null);
    } else {
      this.expandedBudgetId.set(budgetId);
    }
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData.set({
      tipo: '',
      categoria: '',
      descricao_cliente: '',
      showPartsDetail: false
    });
  }

  createBudget(): void {
    const data = this.formData();
    
    if (!data.tipo || !data.categoria || !data.descricao_cliente) {
      this.toastService.error('Preencha todos os campos');
      return;
    }

    this.isCreating.set(true);
    this.budgetService.createBudget({
      tipo: data.tipo,
      categoria: data.categoria,
      descricao_cliente: data.descricao_cliente,
      showPartsDetail: data.showPartsDetail
    }).subscribe({
      next: (newBudget: Budget) => {
        this.isCreating.set(false);
        this.toastService.success('✓ Orçamento criado com sucesso!');
        this.closeCreateModal();
        this.loadBudgets();
      },
      error: (err: any) => {
        this.isCreating.set(false);
        const errorMsg = err.error?.message || 'Erro ao criar orçamento';
        this.toastService.error('✕ ' + errorMsg);
        console.error(err);
      }
    });
  }

  deleteBudget(budgetId: string, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Deseja realmente excluir este orçamento?')) {
      return;
    }

    this.budgetService.deleteBudget(budgetId).subscribe({
      next: () => {
        this.toastService.success('✓ Orçamento excluído com sucesso!');
        this.loadBudgets();
      },
      error: (err: any) => {
        this.toastService.error('✕ Erro ao excluir orçamento');
        console.error(err);
      }
    });
  }

  viewBudgetDetails(budgetId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dashboard/budgets', budgetId]);
  }

  downloadPDF(budgetId: string, event: Event): void {
    event.stopPropagation();
    this.toastService.info('Funcionalidade em desenvolvimento! 🚀');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getStatusLabel(status: BudgetStatus): string {
    return status === BudgetStatus.GERADO ? '✓ Gerado' : '⏳ Pendente';
  }

  updateFormField(field: string, value: string | boolean): void {
    this.formData.set({ ...this.formData(), [field]: value });
  }
}
