import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/videos.service';
import { ImageService } from 'src/app/services/images.service';
import { CommentService } from 'src/app/services/comment.service';
import { CommentResponseDTO } from 'src/app/models/comment-response.model';
import { CommentRequestDTO } from 'src/app/models/comment-request.model';

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.css']
})
export class ResourceViewerComponent implements OnInit {
  resourceType: string | null = null;
  resourceId: number | null = null;
  resource: any = null;
  comments: (CommentResponseDTO & { userName?: string })[] = [];
  newComment: string = '';
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userId: number | null = null; 
  ownerId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private imageService: ImageService,
    private videoService: VideoService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les informations d'authentification
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.userId = this.authService.getCurrentUserId();

    // Récupérer les paramètres depuis l'URL
    this.resourceType = this.route.snapshot.paramMap.get('type');
    this.resourceId = +this.route.snapshot.paramMap.get('id')!;

    // Charger la ressource et ses commentaires
    if (this.resourceType === 'image') {
      this.loadImage(this.resourceId);
    } else if (this.resourceType === 'video') {
      this.loadVideo(this.resourceId);
    }
    this.loadComments(this.resourceId, this.resourceType!);
  }

  loadImage(imageId: number): void {
    this.imageService.getImageById(imageId).subscribe(
      (image) => {
        this.resource = image;
        this.ownerId = image.uploadedById;
        const fullPath = this.resource.path;
        const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        this.resource.path = fileName;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'image.';
        console.error(error);
      }
    );
  }

  loadVideo(videoId: number): void {
    this.videoService.getVideoById(videoId).subscribe(
      (video) => {
        this.resource = video;
        this.ownerId = video.uploadedById;
        const fullPath = this.resource.path;
        const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        this.resource.path = fileName;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement de la vidéo.';
        console.error(error);
      }
    );
  }

  loadComments(resourceId: number, resourceType: string): void {
    this.commentService.getComments(resourceId, resourceType).subscribe(
      (comments: CommentResponseDTO[]) => {
        this.comments = comments;

        this.comments.forEach((comment) => {
          this.userService.getUserById(comment.createdById).subscribe(
            (user) => {
              comment.userName = user.name;
            },
            (error) => {
              console.error('Erreur lors du chargement de l\'utilisateur :', error);
            }
          );
        });
      },
      (error) => {
        this.errorMessage = 'Pas encore de commentaires.';
        console.error(error);
      }
    );
  }

  addComment(): void {
    if (this.newComment.trim() === '') return;

    const commentData: CommentRequestDTO = {
      content: this.newComment,
      imageId: this.resourceType === 'image' ? this.resourceId! : 0,
      videoId: this.resourceType === 'video' ? this.resourceId! : 0,
    };
    console.log(commentData);

    this.commentService.addComment(commentData, this.userId!).subscribe(
      (comment) => {
        this.comments.push(comment);
        this.newComment = '';
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout du commentaire.';
        console.error(error);
      }
    );
  }

  deleteComment(commentId: number): void {
    if (!this.isAdmin && !this.isUserCommentOwner(commentId)) return;

    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter((comment) => comment.id !== commentId);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la suppression du commentaire.';
        console.error(error);
      }
    );
  }

  isUserCommentOwner(commentId: number): boolean {
    const comment = this.comments.find((c) => c.id === commentId);
    return !!comment && comment.createdById === this.userId;
  }

  downloadResource(): void {
    if (this.resourceType === 'image') {
      const downloadUrl = `http://localhost:8089/api/images/download/${this.resource.path}`;
      this.downloadFile(downloadUrl);
    } else if (this.resourceType === 'video') {
      const downloadUrl = `http://localhost:8089/api/videos/download/${this.resource.path}`;
      this.downloadFile(downloadUrl);
    }
  }
  
  private downloadFile(url: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = this.resource.title;
    a.click();
  }

  deleteResource(): void {
    if (!this.isAdmin) {
      this.errorMessage = "Vous n'avez pas les autorisations nécessaires pour supprimer cette ressource.";
      return;
    }

    const deleteObservable =
      this.resourceType === 'image'
        ? this.imageService.deleteImage(this.resourceId!)
        : this.videoService.deleteVideo(this.resourceId!);

    deleteObservable.subscribe(
      () => {
        alert('Ressource supprimée avec succès.');
        if (this.ownerId) {
          // Rediriger vers le portfolio de l'utilisateur propriétaire
          this.router.navigate(['/portfolio', this.ownerId]);
        }
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la suppression de la ressource.';
        console.error(error);
      }
    );
  }

}
