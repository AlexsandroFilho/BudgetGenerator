import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../core/services/budget.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  private budgetService = inject(BudgetService);
  
  @ViewChild('barChart') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  activeChart: 'bar' | 'pie' = 'bar';
  stats: any = null;
  isLoading = true;
  
  private charts: Chart[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.budgetService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        // Wait for view to update before creating charts
        setTimeout(() => this.createCharts(), 100);
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.isLoading = false;
      }
    });
  }

  createCharts() {
    if (!this.stats) return;

    // Destroy existing charts if any
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    // Bar Chart: Categories
    if (this.barChartCanvas) {
      const barCtx = this.barChartCanvas.nativeElement.getContext('2d');
      if (barCtx) {
        this.charts.push(new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Upgrade', 'Reparo', 'Manutenção'],
            datasets: [{
              label: 'Quantidade',
              data: [
                this.stats.byCategory.UPGRADE,
                this.stats.byCategory.REPARO,
                this.stats.byCategory.MANUTENCAO
              ],
              backgroundColor: '#1B3C53',
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Orçamentos por Categoria',
                color: '#1B3C53',
                font: { size: 16, weight: 'bold' }
              }
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
          }
        }));
      }
    }

    // Pie Chart: Types
    if (this.pieChartCanvas) {
      const pieCtx = this.pieChartCanvas.nativeElement.getContext('2d');
      if (pieCtx) {
        this.charts.push(new Chart(pieCtx, {
          type: 'pie',
          data: {
            labels: ['Hardware', 'Software'],
            datasets: [{
              data: [
                this.stats.byType.HARDWARE,
                this.stats.byType.SOFTWARE
              ],
              backgroundColor: ['#456882', '#F18C5D'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: {
                display: true,
                text: 'Distribuição por Tipo',
                color: '#1B3C53',
                font: { size: 16, weight: 'bold' }
              }
            }
          }
        }));
      }
    }
  }

  setChart(type: 'bar' | 'pie') {
    this.activeChart = type;
    // Re-render charts after switch to ensure they fit the container
    setTimeout(() => this.createCharts(), 50);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}
