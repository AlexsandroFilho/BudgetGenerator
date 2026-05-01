import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BudgetCategoria, BudgetTipo } from '../../../../core/models/budget.model';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @Output() budgetCreated = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  // Acessíveis no template
  tipos = Object.values(BudgetTipo);
  categorias = Object.values(BudgetCategoria);

  budgetForm: FormGroup = this.fb.group({
    tipo: [BudgetTipo.SOFTWARE, [Validators.required]],
    categoria: [BudgetCategoria.UPGRADE, [Validators.required]],
    descricao_cliente: ['', [Validators.required, Validators.minLength(10)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.budgetForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.http.post('/api/budgets', this.budgetForm.value)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.budgetForm.reset({ 
              tipo: BudgetTipo.SOFTWARE, 
              categoria: BudgetCategoria.UPGRADE 
            });
            this.budgetCreated.emit();
            this.closeForm.emit();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Falha ao gerar orçamento. Tente novamente.';
          }
        });
    }
  }
}
