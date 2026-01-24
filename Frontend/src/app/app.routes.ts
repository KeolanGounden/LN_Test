import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login/components/login-page/login-page.component';
import { DashboardWrapperComponent } from './modules/dashboard/components/dashboard-wrapper/dashboard-wrapper.component';
import { DashboardService } from './modules/dashboard/states/dashboard.state';
import { CategoriesWrapperComponent } from './modules/categories/components/categories-wrapper/categories-wrapper.component';
import { AdminWrapperComponent } from './modules/layout/admin-wrapper/admin-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'app',
    component: AdminWrapperComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardWrapperComponent, providers: [DashboardService] },
      { path: 'categories', component: CategoriesWrapperComponent },
    ],
  },
];
