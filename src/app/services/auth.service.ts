import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AppRole } from '../enums/AppRole.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8089/api/auth';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUserId(): number | null {
    return localStorage.getItem('currentUserId') ? parseInt(localStorage.getItem('currentUserId')!) : null;
  }

  // Méthode pour envoyer les données x-www-form-urlencoded
  login(username: string, password: string): Observable<string> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    return this.http.post(this.baseUrl + '/login', body.toString(), { headers, responseType: 'text' }).pipe(
      map((response: string) => {
        console.log(response);
        // Extraire le token à partir de la réponse "Bearer <token>"
        return response.substring(7);
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion :', error);
        return throwError(() => new Error('Erreur lors de la connexion'));
      })
    );
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): { sub: string; role: string; exp: number } | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
    return null;
  }

  // Vérifier si le token est valide (non expiré)
  isTokenValid(): boolean {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
      return decodedToken.exp > currentTime;
    }
    return false;
  }

  isAdmin(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.role === AppRole.ADMIN;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
