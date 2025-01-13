import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { IMAGE_URL, VIDEO_URL } from 'src/app/constants';
import { ImageService } from 'src/app/services/images.service';
import { VideoService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  defaultImage = IMAGE_URL;
  defaultVideo = VIDEO_URL;
  
  user: any = null;
  publicImages: any[] = [];
  privateImages: any[] = [];
  publicVideos: any[] = [];
  privateVideos: any[] = [];
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private imageService: ImageService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    const userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUser(userId);
    this.loadImages(userId);
    this.loadVideos(userId);
  }

  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des informations utilisateur.';
        console.error(error);
      }
    );
  }

  loadImages(userId: number): void {
    this.imageService.getImagesByUserId(userId).subscribe(
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
        this.errorMessage = 'Pas d\'images pour cet utilisateur.';
        console.error(error);
      }
    );
  }

  loadVideos(userId: number): void {
    this.videoService.getVideosByUserId(userId).subscribe(
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
        this.errorMessage = 'Pas de vidéos pour cet utilisateur.';
        console.error(error);
      }
    );
  }
}
