import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoDTO } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private baseUrl = 'http://localhost:8089/api/videos';

  constructor(private http: HttpClient) {}

  uploadVideo(file: File, visibility: string, uploadedById: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', visibility);
    formData.append('uploadedById', uploadedById.toString());

    return this.http.post(`${this.baseUrl}`, formData);
  }

  getVideos(): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(this.baseUrl);
  }

  getVideoById(id: number): Observable<VideoDTO> {
    return this.http.get<VideoDTO>(`${this.baseUrl}/${id}`);
  }
  
  getVideosByUserId(userId: number): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  deleteVideo(videoId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8089/api/videos/${videoId}`);
  }
}
