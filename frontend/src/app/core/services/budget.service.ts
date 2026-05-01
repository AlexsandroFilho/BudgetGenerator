import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = '/api/budgets';

  /**
   * Retorna a lista de orçamentos do usuário logado.
   */
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  /**
   * Retorna um orçamento completo pelo ID, incluindo todos os itens e campos detalhados.
   */
  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  /**
   * Exclui um orçamento pelo ID.
   * O backend retorna 204 No Content.
   */
  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Atualiza um orçamento (ex: título ou explicação).
   */
  updateBudget(id: string, data: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Cria um novo orçamento inteligente usando IA.
   */
  createBudget(data: { tipo: string; categoria: string; descricao_cliente: string }): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, data);
  }

  /**
   * Retorna estatísticas dos orçamentos do usuário.
   */
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
