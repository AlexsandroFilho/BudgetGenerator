import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authModalService = inject(AuthModalService);
  const token = authService.getToken();

  let authReq = req;

  // Se o token existir, clonamos a requisição e adicionamos o header Authorization
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se receber 401 (Não Autorizado), faz logout e volta para a home
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/']);
        // Opcional: abrir o modal de login automaticamente
        authModalService.openLogin();
      }
      return throwError(() => error);
    })
  );
};
