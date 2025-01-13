import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // Initialisation du formulaire
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['USER', Validators.required] // Par défaut, rôle 'USER'
    });
  }

  // Méthode pour soumettre le formulaire d'inscription
  signUp(): void {
    if (this.signUpForm.valid) {
      this.userService.addUser(this.signUpForm.value).subscribe(
        (response) => {
          this.successMessage = 'Inscription réussie. Vous pouvez maintenant vous connecter.';
          this.errorMessage = null;
          this.signUpForm.reset(); // Réinitialiser le formulaire après succès
        },
        (error) => {
          this.successMessage = null;
          if (error.status === 409) {
            this.errorMessage = 'Cet email est déjà utilisé par un autre utilisateur.';
          } else {
            this.errorMessage = 'Une erreur s\'est produite lors de l\'inscription.';
          }
          console.error(error);
        }
      );
    }
  }
}
