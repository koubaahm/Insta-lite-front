import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userRole: string | null = null;
  isAdmin: boolean = false;

  profileForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.userRole = decodedToken.role;
      this.isAdmin = this.authService.isAdmin();
    }

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: [this.userRole, Validators.required]
    });

    this.loadUserIdAndProfile();
  }

  loadUserIdAndProfile(): void {
    this.userId = this.authService.getCurrentUserId();
    console.log('User ID:', this.userId);
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (this.userId !== null) {
      this.userService.getUserById(this.userId).subscribe(
        (user) => {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email
          });
          console.log(user);
        },
        (error) => {
          this.errorMessage = 'Impossible de charger les informations utilisateur.';
          console.error(error);
        }
      );
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.userId !== null) {
      this.userService.updateUser(this.userId, this.profileForm.value).subscribe(
        (response) => {
          this.successMessage = 'Votre profil a été mis à jour avec succès.';
          this.errorMessage = null;
        },
        (error) => {
          this.successMessage = null;
          if (error.status === 409) {
            this.errorMessage = 'Cet email est déjà utilisé par un autre utilisateur.';
          } else {
            this.errorMessage = 'Une erreur s\'est produite lors de la mise à jour.';
          }
          console.error(error);
        }
      );
    }
  }
}
