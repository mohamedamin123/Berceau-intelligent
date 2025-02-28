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

}
