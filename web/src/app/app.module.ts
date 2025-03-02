import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './auth/auth.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { NotFoundModule } from './not-found/not-found.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AuthModule,
    NotFoundModule,
    DashboardModule,
  ]
})
export class AppModule { }
