import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = environment.apiUrl + "users";
  private tokenKey = "authToken";
  private platformId = inject(PLATFORM_ID); // Vérifier si on est côté navigateur

  constructor(private http: HttpClient, private router: Router) {}

  // Connexion (SignIn)
  signIn(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.backendUrl}/signin`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  // Stocker le token JWT
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Récupérer le token JWT
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Déconnexion
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(['/login']).then(() => {
    });
  }
}
