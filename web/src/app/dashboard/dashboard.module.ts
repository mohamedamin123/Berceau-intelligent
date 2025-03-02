import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    DashboardComponent,

  ]
})
export class DashboardModule { }
