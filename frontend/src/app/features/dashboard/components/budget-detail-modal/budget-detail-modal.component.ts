import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Budget, BudgetItem } from '../../../../core/models/budget.model';
import { BudgetService } from '../../../../core/services/budget.service';

@Component({
  selector: 'app-budget-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-detail-modal.component.html',
  styleUrls: ['./budget-detail-modal.component.css']
})
export class BudgetDetailModalComponent {
  private budgetService = inject(BudgetService);

  @Input() budget!: Budget;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  isSaving = false;
  isEditing = false;

  closeModal(): void {
    this.close.emit();
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
    }
  }

  saveChanges(): void {
    this.isSaving = true;
    this.budgetService.updateBudget(this.budget.id, {
      technical_description: this.budget.technical_description,
      title: this.budget.title,
      items: this.budget.items
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditing = false;
        this.updated.emit();
        alert('Orçamento Atualizado com Sucesso!');
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Erro ao salvar alterações.');
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  // Getters para separar Hardware (Peças/Equipamentos) de Serviços (Mão de Obra)
  get hardwareItems(): BudgetItem[] {
    const hardwareCategories = ['hardware', 'peça', 'equipamento', 'licença', 'material', 'peça de hardware'];
    return this.budget.items?.filter(item => 
      hardwareCategories.includes(item.category.toLowerCase())
    ) || [];
  }

  get serviceItems(): BudgetItem[] {
    const serviceCategories = ['serviço', 'mão de obra', 'mão-de-obra', 'hora técnica', 'freelance', 'consultoria'];
    return this.budget.items?.filter(item => 
      serviceCategories.includes(item.category.toLowerCase()) || 
      !['hardware', 'peça', 'equipamento', 'licença', 'material', 'peça de hardware'].includes(item.category.toLowerCase())
    ) || [];
  }

  get totalItems(): number {
    return this.budget.items?.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0) || 0;
  }
}
