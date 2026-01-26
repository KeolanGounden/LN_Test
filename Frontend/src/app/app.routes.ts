import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login/components/login-page/login-page.component';

import { CategoriesWrapperComponent } from './modules/categories/components/categories-wrapper/categories-wrapper.component';
import { AdminWrapperComponent } from './modules/layout/admin-wrapper/admin-wrapper.component';
import { ProductDashboardWrapperComponent } from './modules/product-dashboard/components/product-dashboard-wrapper/product-dashboard-wrapper.component';
import { DashboardService } from './modules/product-dashboard/states/dashboard.state';

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
      { path: 'dashboard', component: ProductDashboardWrapperComponent, providers: [DashboardService] },
      { path: 'categories', component: CategoriesWrapperComponent },
    ],
  },
];
