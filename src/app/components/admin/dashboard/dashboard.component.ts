import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/images.service';
import { VideoService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Images
  totalImages: number = 0;
  totalImageSize: number = 0;
  privateImages: number = 0;
  publicImages: number = 0;

  // Vidéos
  totalVideos: number = 0;
  totalVideoSize: number = 0;
  privateVideos: number = 0;
  publicVideos: number = 0;

  loading: boolean = true;

  constructor(
    private imageService: ImageService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.loadImageStats();
    this.loadVideoStats();
  }

  loadImageStats(): void {
    this.imageService.getImages().subscribe(
      (images) => {
        this.totalImages = images.length;
        this.totalImageSize = images.reduce((sum, image) => sum + image.size, 0);
        this.privateImages = images.filter(image => image.visibility === 'PRIVATE').length;
        this.publicImages = images.filter(image => image.visibility === 'PUBLIC').length;
      },
      (error) => {
        console.error('Erreur lors du chargement des images :', error);
      }
    );
  }

  loadVideoStats(): void {
    this.videoService.getVideos().subscribe(
      (videos) => {
        this.totalVideos = videos.length;
        this.totalVideoSize = videos.reduce((sum, video) => sum + video.size, 0);
        this.privateVideos = videos.filter(video => video.visibility === 'PRIVATE').length;
        this.publicVideos = videos.filter(video => video.visibility === 'PUBLIC').length;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des vidéos :', error);
        this.loading = false;
      }
    );
  }
}
