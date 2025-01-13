import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Visibility } from 'src/app/enums/Visibility.enum';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent {

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

  onUpload(): void {
    var input = document.querySelector('input[type="file"]') as HTMLInputElement;
    var data = new FormData();
    data.append('file', input!.files![0]);
    data.append('visibility', this.visibility);
    data.append('uploadedById', this.authService.getCurrentUserId()!.toString());
    fetch('http://localhost:8089/api/videos', {
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

  // uploadVideo(): void {
  //   if (this.selectedFile) {
  //     this.videoService.uploadVideo(this.selectedFile, this.visibility, this.userId).subscribe(
  //       (response) => {
  //         this.successMessage = 'Vidéo uploadée avec succès.';
  //         this.errorMessage = null;
  //         console.log('Réponse du serveur :', response);
  //       },
  //       (error) => {
  //         this.successMessage = null;
  //         this.errorMessage = 'Une erreur s\'est produite lors de l\'upload de la vidéo.';
  //         console.error('Erreur :', error);
  //       }
  //     );
  //   } else {
  //     this.errorMessage = 'Aucun fichier sélectionné.';
  //   }
  // }
}
