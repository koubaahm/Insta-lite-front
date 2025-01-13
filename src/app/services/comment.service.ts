import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDTO } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8089/api/comments';

  constructor(private http: HttpClient) {}

  addComment(commentData: any, userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${userId}`, commentData);
  }

  getComments(resourceId: number, resourceType: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${resourceType}/${resourceId}`);
  }

  // Récupérer les commentaires associés à une vidéo
  getCommentsByVideo(videoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/video/${videoId}`);
  }

  // Récupérer les commentaires associés à une image
  getCommentsByImage(imageId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/image/${imageId}`);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentId}`);
  }
}
