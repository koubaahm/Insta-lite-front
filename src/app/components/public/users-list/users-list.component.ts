import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  errorMessage: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the logged-in user is an admin
    this.isAdmin = this.authService.isAdmin();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.users = this.filterUsers();
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
        console.error(error);
      }
    );
  }

  filterUsers(): any[] {
    // If the logged-in user is not an admin, filter out admin users
    return this.isAdmin
      ? this.users // Admin sees all users
      : this.users.filter((user) => user.role !== 'ADMIN'); // Non-admin users only see non-admins
  }

  viewPortfolio(userId: number): void {
    this.router.navigate(['/portfolio', userId]);
  }
}
