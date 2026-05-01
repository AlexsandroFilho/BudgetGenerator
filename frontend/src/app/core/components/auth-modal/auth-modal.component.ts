import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="btn-modal-close" (click)="close()">×</button>
<
        <!-- LOGIN -->
        <div *ngIf="mode === 'login'">
          <div class="modal-header">
            <h2>Bem-vindo de volta!</h2>
            <p>Acesse sua conta para gerenciar seus orçamentos.</p>
          </div>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" formControlName="email" placeholder="seu@email.com">
            </div>
            <div class="form-group">
              <label>Senha</label>
              <div class="password-input-container">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="senha" placeholder="••••••••">
                <button type="button" class="btn-toggle-password" (click)="togglePassword()">
                  <span *ngIf="!showPassword">👁️</span>
                  <span *ngIf="showPassword">🙈</span>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="rememberMe">
                <span class="checkmark"></span>
                Lembrar de mim
              </label>
            </div>

            <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>
            <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary btn-block">
              <span *ngIf="!isLoading">Entrar</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </form>
          <div class="modal-footer">
            <p>Não tem conta? <button class="btn-link" (click)="setMode('register')">Cadastre-se grátis</button></p>
          </div>
        </div>

        <!-- REGISTER -->
        <div *ngIf="mode === 'register'">
          <div class="modal-header">
            <h2>Crie sua conta</h2>
            <p>Comece a gerar orçamentos inteligentes agora mesmo.</p>
          </div>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" formControlName="nome" placeholder="Seu nome">
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" formControlName="email" placeholder="seu@email.com">
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="tel" formControlName="telefone" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
              <label>Senha</label>
              <div class="password-input-container">
                <input [type]="showPassword ? 'text' : 'password'" formControlName="senha" placeholder="Mínimo 6 caracteres">
                <button type="button" class="btn-toggle-password" (click)="togglePassword()">
                  <span *ngIf="!showPassword">👁️</span>
                  <span *ngIf="showPassword">🙈</span>
                </button>
              </div>
            </div>
            <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>
            <button type="submit" [disabled]="registerForm.invalid || isLoading" class="btn btn-primary btn-block">
              <span *ngIf="!isLoading">Criar Conta</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </form>
          <div class="modal-footer">
            <p>Já tem conta? <button class="btn-link" (click)="setMode('login')">Fazer login</button></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private destroy$ = new Subject<void>();

  mode: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  registerForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.authModalService.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.mode = state.mode;
      this.errorMessage = '';
      this.showPassword = false; // Reset password visibility when switching modes
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMode(mode: 'login' | 'register'): void {
    this.errorMessage = '';
    this.authModalService.setMode(mode);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  close(): void {
    this.authModalService.close();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, senha, rememberMe } = this.loginForm.value;
      
      this.http.post<{ token: string }>('/api/login', { email, senha, rememberMe }).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token, rememberMe);
          this.isLoading = false;
          this.authModalService.close();
          this.loginForm.reset({ rememberMe: false });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Credenciais inválidas.';
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.http.post('/api/users', this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.setMode('login');
          this.errorMessage = '';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'Falha ao cadastrar. Tente novamente.';
        }
      });
    }
  }
}
