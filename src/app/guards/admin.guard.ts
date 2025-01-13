import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin() && this.authService.isTokenValid()) {
      return true; // Autoriser l'accès
    }
    this.router.navigate(['/login']); // Rediriger si non autorisé
    return false;
  }
}
