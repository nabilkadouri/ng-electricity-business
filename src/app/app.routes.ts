import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { CheckCodeComponent } from './components/check-code/check-code.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginFormComponent},
  { path: 'check', component: CheckCodeComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'dashboard',  component: DashboardComponent}
];
