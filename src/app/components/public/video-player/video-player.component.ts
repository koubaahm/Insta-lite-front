import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @Input() videoSrc!: string; // L'URL de la vidéo à afficher
  @Input() videoTitle: string = 'Video'; // Titre optionnel pour la vidéo
}
