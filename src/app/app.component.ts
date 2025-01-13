import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'insta-lite';

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  get userName(): string {
    const decodedToken = this.authService.getDecodedToken();
    return decodedToken?.sub || 'Guest';
  }

  getPortfolioLink(): string {
    const userId = this.authService.getCurrentUserId();
    return `/portfolio/${userId}`;
  }
  

  logout(): void {
    this.authService.logout();
  }
}
