import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Visibility } from 'src/app/enums/Visibility.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/images.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {  

  selectedFile: File | null = null;
  visibility: Visibility = Visibility.PUBLIC;
  uploadedById: number | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Méthode pour soumettre le formulaire
  // onUpload(): void {
  //   if (this.selectedFile) {
  //     this.imageService.uploadImage(this.selectedFile, this.visibility, this.authService.getCurrentUserId()!).subscribe(
  //       (response) => {
  //         this.successMessage = 'Image téléchargée avec succès.';
  //         this.errorMessage = null;
  //       },
  //       (error) => {
  //         this.successMessage = null;
  //         this.errorMessage = 'Une erreur s\'est produite lors du téléchargement.';
  //       }
  //     );
  //   } else {
  //     this.errorMessage = 'Veuillez sélectionner un fichier.';
  //   }
  // }

  onUpload(): void {
    var input = document.querySelector('input[type="file"]') as HTMLInputElement;
    var data = new FormData();
    data.append('file', input!.files![0]);
    data.append('visibility', this.visibility);
    data.append('uploadedById', this.authService.getCurrentUserId()!.toString());
    fetch('http://localhost:8089/api/images/upload', {
        method: 'POST',
        body: data
    })
    .then(response => Promise.all([response.status, response.json()]))
    .then(([status, myJson]) => {
        if (status == 201) {
            console.log("succeed!");
            this.router.navigate(['/portfolio', this.authService.getCurrentUserId()]);
        } else {
            console.log("failed!");
        }
    })
    .catch(error => console.log(error.message));
  }
}
