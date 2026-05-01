import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { BudgetFormComponent } from './components/budget-form/budget-form.component';
import { BudgetListComponent } from './components/budget-list/budget-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BudgetFormComponent, BudgetListComponent],
  template: `
    <div class="container dashboard-container">
      <div class="dashboard-header">
        <h1 class="welcome-text">Seus Orçamentos Inteligentes 🚀</h1>
        <p>Gerencie e gere orçamentos de alta precisão com IA.</p>
      </div>

      <div class="action-center">
        <button *ngIf="!showForm" (click)="showForm = true" class="btn btn-primary btn-hero">
          <span class="icon">+</span> Gerar Novo Orçamento
        </button>

        <div *ngIf="showForm" class="form-wrapper">
          <app-budget-form (closeForm)="showForm = false"></app-budget-form>
        </div>
      </div>

      <div class="list-section">
        <app-budget-list></app-budget-list>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 120px 20px 60px;
      max-width: 900px;
      margin: 0 auto;
    }
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
    .welcome-text {
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 8px;
    }
    .action-center {
      display: flex;
      justify-content: center;
      margin-bottom: 60px;
    }
    .btn-hero {
      padding: 20px 40px;
      font-size: 1.25rem;
      border-radius: 50px;
      box-shadow: 0 10px 30px rgba(27, 60, 83, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn-hero .icon {
      font-size: 1.8rem;
      font-weight: 300;
    }
    .form-wrapper {
      width: 100%;
      max-width: 600px;
      animation: slideDown 0.4s ease-out;
    }
    .list-section {
      width: 100%;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  showForm = false;
}
