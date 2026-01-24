import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login/components/login-page/login-page.component';
import { DashboardWrapperComponent } from './modules/dashboard/components/dashboard-wrapper/dashboard-wrapper.component';
import { DashboardService } from './modules/dashboard/states/dashboard.state';



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
    path: 'dashboard',
    component: DashboardWrapperComponent,
    providers: [DashboardService]
  }
 
];
