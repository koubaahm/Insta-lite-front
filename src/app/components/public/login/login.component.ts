import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (token) => {
        this.authService.saveToken(token);

        this.userService.getUsers().subscribe(
          (users) => {
            const currentUser = users.find((user: any) => user.email === this.email);
            if (currentUser) {
              localStorage.setItem('currentUserId', currentUser.id.toString());
            }

            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la récupération des utilisateurs.';
            console.error(error);
          }
        );
      },
      (error) => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        console.log(this.errorMessage);
      }
    );
  }
}
