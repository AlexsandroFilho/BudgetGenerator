import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { BudgetService } from '../../core/services/budget.service';
import { Budget, BudgetCategoria, BudgetTipo } from '../../core/models/budget.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  private authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private budgetService = inject(BudgetService);
  private fb = inject(FormBuilder);

  isLoggedIn = false;
  user: any = null;

  // Orçamentos
  budgets: Budget[] = [];
  pagedBudgets: Budget[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  isLoadingBudgets = false;
  expandedBudgetId: string | null = null;

  // Edição
  editingBudget: Budget | null = null;
  editForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    technical_description: ['', Validators.required]
  });
  isSavingEdit = false;

  // Formulário de Criação
  showForm = false;
  isSubmitting = false;
  tipos = Object.values(BudgetTipo);
  categorias = Object.values(BudgetCategoria);
  budgetForm: FormGroup = this.fb.group({
    tipo: [BudgetTipo.SOFTWARE, Validators.required],
    categoria: [BudgetCategoria.UPGRADE, Validators.required],
    descricao_cliente: ['', [Validators.required, Validators.minLength(10)]]
  });
  formError = '';

  servicos = [
    { titulo: 'Upgrade', descricao: 'Eleve a performance com as melhores sugestões de hardware e software orientadas por IA.', icon: '🚀' },
    { titulo: 'Reparo', descricao: 'Identificação rápida de falhas e orçamentos precisos para reparos técnicos especializados.', icon: '🛠️' },
    { titulo: 'Manutenção', descricao: 'Planos preventivos para garantir que seu equipamento nunca te deixe na mão.', icon: '🛡️' }
  ];

  ngOnInit(): void {
    this.authService.user$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadBudgets();
        this.loadProfile();
      }
    });
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe(user => this.user = user);
  }

  openLogin(): void { this.authModalService.openLogin(); }
  openRegister(): void { this.authModalService.openRegister(); }

  loadBudgets(): void {
    this.isLoadingBudgets = true;
    this.budgetService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        this.totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));
        this.goToPage(1);
        this.isLoadingBudgets = false;
      },
      error: () => { this.isLoadingBudgets = false; }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedBudgets = this.budgets.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleExpandBudget(id: string): void {
    this.expandedBudgetId = this.expandedBudgetId === id ? null : id;
  }

  onEditBudget(budget: Budget, event?: Event): void {
    if (event) event.stopPropagation();
    this.editingBudget = budget;
    this.editForm.patchValue({
      title: budget.title,
      technical_description: budget.technical_description
    });
  }

  closeEdit(): void {
    this.editingBudget = null;
  }

  onSaveBudget(): void {
    if (this.editForm.valid && this.editingBudget) {
      this.isSavingEdit = true;
      this.budgetService.updateBudget(this.editingBudget.id, this.editForm.value).subscribe({
        next: () => {
          this.isSavingEdit = false;
          this.editingBudget = null;
          this.loadBudgets();
        },
        error: (err) => {
          this.isSavingEdit = false;
          alert(err.error?.message || 'Erro ao salvar alterações.');
        }
      });
    }
  }

  submitBudget(): void {
    if (this.budgetForm.valid) {
      this.isSubmitting = true;
      this.formError = '';
      this.budgetService.createBudget(this.budgetForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showForm = false;
          this.budgetForm.reset({ tipo: BudgetTipo.SOFTWARE, categoria: BudgetCategoria.UPGRADE });
          this.loadBudgets();
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.formError = err.error?.message || 'Erro ao gerar orçamento.';
        }
      });
    }
  }

  handleDelete(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Deseja excluir este orçamento?')) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => this.loadBudgets(),
        error: (err: any) => alert(err.error?.message || 'Erro ao excluir orçamento.')
      });
    }
  }

  downloadBudget(budget: Budget, event?: Event): void {
    if (event) event.stopPropagation();
    
    const doc = new jsPDF();
    const primaryColor = [27, 60, 83];
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('ORÇAMENTO COMERCIAL', 20, 25);
    
    doc.setFontSize(10);
    doc.text(`ID: ${budget.id.substring(0, 8).toUpperCase()}`, 160, 25);
    
    // User Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Prestador de Serviço:', 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(this.user?.nome || 'Consultor Técnico', 20, 62);
    doc.text(this.user?.email || '', 20, 68);
    if (this.user?.telefone) doc.text(this.user.telefone, 20, 74);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Data de Emissão:', 140, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatDate(budget.criado_em), 140, 62);
    
    // Title
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 85, 190, 85);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(budget.title || 'Proposta de Serviço', 20, 100);
    
    // Technical Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(budget.technical_description || '', 170);
    doc.text(splitDesc, 20, 110);
    
    // Items Table
    const tableData = (budget.items || []).map(item => [
      item.descricao,
      item.quantidade + ' ' + item.unidade,
      this.formatCurrency(Number(item.valor_unitario)),
      this.formatCurrency(Number(item.valor_unitario) * item.quantidade)
    ]);
    
    autoTable(doc, {
      startY: 120 + (splitDesc.length * 5),
      head: [['Descrição', 'Qtd', 'Unitário', 'Subtotal']],
      body: tableData,
      headStyles: { fillColor: primaryColor as any },
      foot: [['', '', 'TOTAL ESTIMADO:', this.formatCurrency(Number(budget.total_estimado))]],
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Este documento foi gerado automaticamente por IA.', 105, finalY, { align: 'center' });
    
    doc.save(`orcamento-${budget.id.substring(0, 8)}.pdf`);
  }

  getStatusClass(status: string): string {
    return status === 'GERADO' ? 'badge-gerado' : 'badge-pendente';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
