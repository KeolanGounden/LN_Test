import { Routes } from '@angular/router';
import { LandingWrapperComponent } from './modules/landing-page/components/landing-wrapper/landing-wrapper.component';
import { LoginPageComponent } from './modules/login/components/login-page/login-page.component';
import { DashboardWrapperComponent } from './modules/dashboard/components/dashboard-wrapper/dashboard-wrapper.component';
import { provideStates } from '@ngxs/store';
import { DashboardState } from './modules/dashboard/states/dashboard.state';



export const routes: Routes = [
{
    path: '',
    component: LandingWrapperComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardWrapperComponent,
    providers: [provideStates([DashboardState])]
  }
 
];
