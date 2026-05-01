import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Chamada para a API através do nosso proxy (/api/login)
      this.http.post<{ token: string }>('/api/login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            this.authService.saveToken(response.token);
            this.isLoading = false;
            // Redirecionar para a home ou dashboard (a ser criado)
            this.router.navigate(['/']); 
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Falha ao autenticar. Verifique suas credenciais.';
          }
        });
    }
  }
}
