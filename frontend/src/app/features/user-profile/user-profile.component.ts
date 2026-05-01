import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  user: any = null;
  isLoading = true;
  passwordForm: FormGroup;
  
  passwordMessage = '';
  passwordError = '';
  isSaving = false;
  
  editingPhone = false;
  newPhone = '';
  updatingProfile = false;

  constructor() {
    this.passwordForm = this.fb.group({
      senhaAntiga: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.newPhone = data.telefone || '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('novaSenha')?.value === g.get('confirmarSenha')?.value
      ? null : { 'mismatch': true };
  }

  toggleEditPhone(): void {
    this.editingPhone = !this.editingPhone;
    if (!this.editingPhone) {
      this.newPhone = this.user.telefone || '';
    }
  }

  onUpdateProfile(): void {
    this.updatingProfile = true;
    this.authService.updateProfile({ telefone: this.newPhone }).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editingPhone = false;
        this.updatingProfile = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil', err);
        this.updatingProfile = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.updatingProfile = true;
        this.authService.updateProfile({ avatarUrl: base64Image }).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.updatingProfile = false;
          },
          error: (err) => {
            console.error('Erro ao atualizar avatar', err);
            this.updatingProfile = false;
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      this.isSaving = true;
      this.passwordMessage = '';
      this.passwordError = '';

      const { senhaAntiga, novaSenha } = this.passwordForm.value;

      this.authService.updatePassword(senhaAntiga, novaSenha).subscribe({
        next: () => {
          this.isSaving = false;
          this.passwordMessage = 'Senha alterada com sucesso! 🛡️';
          this.passwordForm.reset();
        },
        error: (err) => {
          this.isSaving = false;
          this.passwordError = err.error?.error || 'Falha ao alterar senha. Verifique os dados.';
        }
      });
    }
  }
}
