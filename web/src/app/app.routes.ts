import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './not-found/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //Login
  { path: 'login', component: LoginComponent },
  //dashboard
  { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard]  },


    // Page Not Found (404)
    { path: '**', component: NotFoundComponent } // Ajoute cette ligne !

];
