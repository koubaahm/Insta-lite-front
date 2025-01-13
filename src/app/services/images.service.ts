import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageDTO, ImageResponseDTO } from '../models/image.model';
import { AuthService } from './auth.service';
import { Visibility } from '../enums/Visibility.enum';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:8089/api/images';

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  // Récupérer toutes les images
  getImages(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(this.baseUrl);
  }

  // Récupérer une image par ID
  getImageById(id: number): Observable<ImageDTO> {
    return this.http.get<ImageDTO>(`${this.baseUrl}/${id}`);
  }

  getImagesByUserId(userId: number): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${imageId}`);
  }

  updateImageVisibility(imageId: number, visibility: string): Observable<void> {
    const body = { visibility };
    return this.http.put<void>(`${this.baseUrl}/${imageId}`, body);
  }
}
