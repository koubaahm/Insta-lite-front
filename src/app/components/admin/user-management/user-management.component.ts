import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  userForm: FormGroup;
  isEditing: boolean = false;
  showForm: boolean = false; // Variable pour afficher/masquer le formulaire
  errorMessage: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      password: [''],
      isActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
        console.error(error);
      }
    );
  }

  toggleForm(): void {
    this.showForm = !this.showForm; // Inverse l'état du formulaire
    if (!this.showForm) {
      this.isEditing = false;
      this.selectedUser = null;
      this.userForm.reset({ role: 'USER' }); // Réinitialise le formulaire si on annule
    }
  }

  prepareCreate(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({ role: 'USER' });
    this.showForm = true; // Affiche le formulaire
  }

  prepareEdit(user: any): void {
    this.isEditing = true;
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.showForm = true; // Affiche le formulaire
  }

  submitForm(): void {
    if (this.userForm.valid) {
      if (!this.isEditing) {
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      }

      if (this.isEditing && this.selectedUser) {
        this.userService.updateUser(this.selectedUser.id, this.userForm.value).subscribe(
          () => {
            window.alert('Utilisateur mis à jour avec succès.');
            this.errorMessage = null;
            this.loadUsers();
            this.toggleForm(); // Masque le formulaire après la mise à jour
          },
          (error) => {
            if (error.status === 409) {
              this.errorMessage = 'Cet email est déjà utilisé par un autre utilisateur.';
            } else {
              this.errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur.';
            }
            window.alert(this.errorMessage);
            console.error(error);
          }
        );
      } else {
        this.userService.addUser(this.userForm.value).subscribe(
          () => {
            window.alert('Utilisateur créé avec succès.');
            this.errorMessage = null;
            this.loadUsers();
            this.toggleForm(); // Masque le formulaire après la création
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la création de l\'utilisateur.';
            window.alert(this.errorMessage);
            console.error(error);
          }
        );
      }
    }
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          window.alert('Utilisateur supprimé avec succès.');
          this.errorMessage = null;
          this.loadUsers();
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur.';
          window.alert(this.errorMessage);
          console.error(error);
        }
      );
    }
  }
}
