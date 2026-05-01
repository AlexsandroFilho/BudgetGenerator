import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { AuthModalComponent } from './core/components/auth-modal/auth-modal.component';
import { ToastContainerComponent } from './core/components/toast-container/toast-container.component';
import { AuthModalService, AuthModalState } from './core/services/auth-modal.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AuthModalComponent, ToastContainerComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <!-- Modal de autenticação global -->
    <app-auth-modal *ngIf="modalState.isOpen"></app-auth-modal>
    <!-- Toast Container global -->
    <app-toast-container></app-toast-container>
  `,
  styles: [`main { min-height: 100vh; }`]
})
export class AppComponent implements OnInit {
  private authModalService = inject(AuthModalService);
  private authService = inject(AuthService);
  
  modalState: AuthModalState = { isOpen: false, mode: 'login' };

  ngOnInit(): void {
    this.authModalService.state$.subscribe(state => {
      this.modalState = state;
    });

    // Se houver token, tenta validar buscando o perfil
    if (this.authService.hasToken()) {
      this.authService.getProfile().subscribe({
        error: () => {
          // O interceptor já cuida do logout e redirecionamento em caso de 401
        }
      });
    }
  }
}
