import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './pages/auth/register/register.component';
import {LoginComponent} from './pages/auth/login/login.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
];
