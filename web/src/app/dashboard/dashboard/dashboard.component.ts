import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { GaucheComponent } from "../gauche/gauche.component";
import { RouterLink } from '@angular/router';
import { UserComponent } from "../user/user.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GaucheComponent, RouterLink, UserComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats: any = {};
  users: any[] = [];
  constructor(private dashboardService: UsersService) {}

  ngOnInit() {
    this.stats = this.dashboardService.getStats();
    this.users = this.dashboardService.getRecentUsers();
  }
}
