import { Component, OnInit } from '@angular/core';
import { Visibility } from 'src/app/enums/Visibility.enum';
import { ImageDTO } from 'src/app/models/image.model';
import { VideoDTO } from 'src/app/models/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/images.service';
import { VideoService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  publicImages: any[] = [];
  privateImages: any[] = [];
  publicVideos: any[] = [];
  privateVideos: any[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService, 
    private imageService: ImageService, 
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.imageService.getImages().subscribe(
      (data) => {
        this.publicImages = data.filter((img: ImageDTO) => img.visibility === Visibility.PUBLIC);
        this.privateImages = data.filter((img: ImageDTO) => img.visibility === Visibility.PRIVATE);
        },
      (error) => {
        console.error('Erreur lors du chargement des images :', error);
      }
    );

    this.videoService.getVideos().subscribe(
      (data) => {
        this.publicVideos = data.filter((vid: VideoDTO) => vid.visibility === Visibility.PUBLIC);
        this.privateVideos = data.filter((vid: VideoDTO) => vid.visibility === Visibility.PRIVATE);
      },
      (error) => {
        console.error('Erreur lors du chargement des vidéos :', error);
      }
    );
  }
}
