import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private userSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable para que outros componentes se inscrevam
  public user$: Observable<boolean> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Busca os dados do perfil do usuário logado
   */
  public getProfile(): Observable<any> {
    return this.http.get('/api/users/me');
  }

  /**
   * Atualiza os dados do perfil do usuário
   */
  public updateProfile(data: { nome?: string; email?: string; telefone?: string; avatarUrl?: string }): Observable<any> {
    return this.http.put('/api/users/me', data);
  }

  /**
   * Altera a senha do usuário
   */
  public updatePassword(senhaAntiga: string, novaSenha: string): Observable<void> {
    return this.http.patch<void>('/api/users/password', { senhaAntiga, novaSenha });
  }

  /**
   * Salva o token JWT no storage e atualiza o estado de login
   * @param token String do token JWT recebido do backend
   * @param rememberMe Se true, salva no localStorage, senão no sessionStorage
   */
  public saveToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
    this.userSubject.next(true);
  }

  /**
   * Recupera o token JWT de qualquer um dos storages
   * @returns O token ou null se não existir
   */
  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove o token de ambos os storages e notifica os observadores (Logout)
   */
  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(false);
  }

  /**
   * Verifica se existe um token persistido localmente
   * @returns true se o usuário estiver autenticado, false caso contrário
   */
  public isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Helper para checar a existência do token
   */
  public hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY));
    }
    return false;
  }
}
