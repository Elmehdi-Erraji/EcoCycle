import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/auth/register/register.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {Error404Component} from './pages/errors/error-404/error-404.component';
import {HomeComponent} from './pages/home/home.component';
import {SuccessComponent} from './pages/success/success.component';
import {AuthGuard} from './core/guards/auth.guard';
import {RoleGuard} from './core/guards/role.guard';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {DashComponent} from './pages/dashboard/individual/dash/dash.component';
import {DashComponent1} from './pages/dashboard/collector/dash/dash1.component';
import {CollectsComponent} from './pages/dashboard/collector/collects/collects.component';
import {CouponsComponent} from './pages/dashboard/individual/coupons/coupons.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path:"success", component: SuccessComponent},



  {
    path: 'collector',
    component: NavbarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['collector'] }, // Only 'collector' role can access
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashComponent1 },
      {path: 'myCollections', component: CollectsComponent},
    ]
  },
  {
    path: 'particulier',
    component: NavbarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['particulier'] }, // Only 'particulier' role can access
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashComponent},
      { path: 'myCoupons', component: CouponsComponent},
    ]
  },


  {path: "**", component: Error404Component},


];
