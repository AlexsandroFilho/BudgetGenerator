import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthModalMode = 'login' | 'register';

export interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
}

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private state = new BehaviorSubject<AuthModalState>({ isOpen: false, mode: 'login' });
  state$ = this.state.asObservable();

  openLogin(): void {
    this.state.next({ isOpen: true, mode: 'login' });
  }

  openRegister(): void {
    this.state.next({ isOpen: true, mode: 'register' });
  }

  setMode(mode: AuthModalMode): void {
    this.state.next({ ...this.state.getValue(), mode });
  }

  close(): void {
    this.state.next({ isOpen: false, mode: 'login' });
  }
}
