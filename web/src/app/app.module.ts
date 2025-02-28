import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './auth/auth.module';
import { NotFoubdModule } from './app/not-foubd/not-foubd.module';
import { NotFoundModule } from './app/not-found/not-found.module';
import { DashboardModule } from './dashboard/dashboard.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AuthModule,
    NotFoubdModule,
    NotFoundModule,
    DashboardModule,
  ]
})
export class AppModule { }
