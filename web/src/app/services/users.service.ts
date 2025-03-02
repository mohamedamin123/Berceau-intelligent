import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private backendUrl = environment.apiUrl + "users"; // URL de ton backend Express

  constructor(private http: HttpClient) { }

  getStats() {
    return { totalUsers: 1200, onlineUsers: 250, newUsers: 30 };
  }

  getRecentUsers() {
    return [
      { name: 'Alice', email: 'alice@example.com', online: true },
      { name: 'Bob', email: 'bob@example.com', online: false },
      { name: 'Charlie', email: 'charlie@example.com', online: true },
    ];
  }

}
