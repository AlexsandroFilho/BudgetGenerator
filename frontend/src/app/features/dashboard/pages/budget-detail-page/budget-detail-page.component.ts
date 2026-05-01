import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../../../../core/services/budget.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Budget } from '../../../../core/models/budget.model';

@Component({
  selector: 'app-budget-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-detail-page.component.html',
  styleUrls: ['./budget-detail-page.component.css']
})
export class BudgetDetailPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private budgetService = inject(BudgetService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  budget = signal<Budget | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  todayDate = new Date();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const budgetId = params['id'];
      if (!budgetId) {
        this.error.set('ID do orçamento não encontrado');
        this.isLoading.set(false);
        return;
      }
      this.loadBudgetDetails(budgetId);
    });
  }

  private loadBudgetDetails(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.budgetService.getBudgetById(id).subscribe({
      next: (data: Budget) => {
        this.budget.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar orçamento:', err);
        const errorMessage = err.error?.message || 'Erro ao carregar orçamento';
        this.error.set(errorMessage);
        this.toastService.error('✕ ' + errorMessage);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  handlePrint(): void {
    window.print();
  }

  handleDownloadPDF(): void {
    this.toastService.info('Funcionalidade de PDF em desenvolvimento! 🚀');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }

  getHardwareItems() {
    const budget = this.budget();
    if (!budget || !Array.isArray(budget.items)) return [];
    return budget.items.filter(item => item.category?.toUpperCase() === 'HARDWARE' || !item.category);
  }

  getServiceItems() {
    const budget = this.budget();
    if (!budget || !Array.isArray(budget.items)) return [];
    return budget.items.filter(item => item.category?.toUpperCase() === 'SOFTWARE');
  }

  calculateHardwareTotal(): number {
    return this.getHardwareItems().reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
  }

  calculateServiceTotal(): number {
    return this.getServiceItems().reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
  }

  calculateGrandTotal(): number {
    const budget = this.budget();
    if (!budget) return 0;
    return this.calculateHardwareTotal() + this.calculateServiceTotal();
  }
}
