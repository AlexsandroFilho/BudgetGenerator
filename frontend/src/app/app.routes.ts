import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BudgetDetailPageComponent } from './features/dashboard/pages/budget-detail-page/budget-detail-page.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard],
    children: [
      {
        path: 'budgets/:id',
        component: BudgetDetailPageComponent,
        canActivate: [authGuard]
      }
    ]
  },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
