import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget, BudgetItem } from '../../../../core/models/budget.model';
import { BudgetService } from '../../../../core/services/budget.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-detail.component.html',
  styleUrls: ['./budget-detail.component.css']
})
export class BudgetDetailComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  @Input() budget!: Budget;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  isEditing = false;
  isSaving = false;
  editForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      title: [this.budget.title || '', [Validators.required, Validators.minLength(5)]],
      technical_description: [this.budget.technical_description || '', [Validators.required, Validators.minLength(15)]]
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
      this.initializeForm();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      this.toastService.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isSaving = true;
    const updatedData = {
      title: this.editForm.get('title')?.value,
      technical_description: this.editForm.get('technical_description')?.value,
      items: this.budget.items
    };

    this.budgetService.updateBudget(this.budget.id, updatedData).subscribe({
      next: () => {
        this.budget.title = updatedData.title;
        this.budget.technical_description = updatedData.technical_description;
        this.isSaving = false;
        this.isEditing = false;
        this.updated.emit();
        this.toastService.success('✓ Proposta atualizada com sucesso!');
      },
      error: (err) => {
        this.isSaving = false;
        this.toastService.error('✕ Erro ao salvar: ' + (err.error?.message || 'Tente novamente.'));
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  get hardwareItems(): BudgetItem[] {
    const hardwareKeywords = ['hardware', 'peça', 'equipamento', 'licença', 'material', 'componente', 'placa', 'memória', 'processador', 'ssd', 'hd'];
    return this.budget.items?.filter(item => 
      hardwareKeywords.some(keyword => item.category.toLowerCase().includes(keyword))
    ) || [];
  }

  get serviceItems(): BudgetItem[] {
    const hardwareKeywords = ['hardware', 'peça', 'equipamento', 'licença', 'material', 'componente', 'placa', 'memória', 'processador', 'ssd', 'hd'];
    return this.budget.items?.filter(item => 
      !hardwareKeywords.some(keyword => item.category.toLowerCase().includes(keyword))
    ) || [];
  }

  get hardwareSubtotal(): number {
    return this.hardwareItems.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0);
  }

  get serviceSubtotal(): number {
    return this.serviceItems.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0);
  }

  get grandTotal(): number {
    return this.hardwareSubtotal + this.serviceSubtotal;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  }
}
