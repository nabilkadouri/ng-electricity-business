import { Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard-layout/dashboard/dashboard.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { HomeComponent } from './layouts/public-layout/components/home/home.component';
import { LoginFormComponent } from './layouts/public-layout/components/login-form/login-form.component';
import { CheckCodeComponent } from './layouts/public-layout/components/check-code/check-code.component';
import { RegisterFormComponent } from './layouts/public-layout/components/register-form/register-form.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent},
      { path: 'login', component: LoginFormComponent},
      { path: 'check', component: CheckCodeComponent },
      { path: 'register', component: RegisterFormComponent },
    ]
  },

  {
    path:'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path:'', component: DashboardComponent}
    ]
  },

  { path: '**', redirectTo: '' },
  
];
