import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/images.service';
import { VideoService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicImages: any[] = [];
  privateImages: any[] = [];
  publicVideos: any[] = [];
  privateVideos: any[] = [];
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private imageService: ImageService,
    private videoService: VideoService
    ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadImages();
    this.loadVideos();
  }

  loadImages(): void {
    this.imageService.getImages().subscribe(
      (images) => {
        images.forEach((image) => {
          const fullPath = image.path;
          const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
          image.path = fileName;
        });
        
        this.publicImages = images.filter((image) => image.visibility === 'PUBLIC');
        if (this.isLoggedIn) {
          this.privateImages = images.filter((image) => image.visibility === 'PRIVATE');
        }
      },
      (error) => {
        this.errorMessage = 'Pas d\'images à afficher.';
        console.error(error);
      }
    );
  }

  loadVideos(): void {
    this.videoService.getVideos().subscribe(
      (videos) => {
        videos.forEach((video) => {
          const fullPath = video.path;
          const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
          video.path = 'http://localhost:8089/api/videos/view/' + fileName;
        });
        
        this.publicVideos = videos.filter((video) => video.visibility === 'PUBLIC');
        if (this.isLoggedIn) {
          this.privateVideos = videos.filter((video) => video.visibility === 'PRIVATE');
        }
      },
      (error) => {
        this.errorMessage = 'Pas de vidéos à afficher.';
        console.error(error);
      }
    );
  }
}
