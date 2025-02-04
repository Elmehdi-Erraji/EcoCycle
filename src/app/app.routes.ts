import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/auth/register/register.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {Error404Component} from './pages/errors/error-404/error-404.component';
import {HomeComponent} from './pages/home/home.component';
import {SuccessComponent} from './pages/success/success.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path:"success", component: SuccessComponent},
  {path: "**", component: Error404Component},
];
