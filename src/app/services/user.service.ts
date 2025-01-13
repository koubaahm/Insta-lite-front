import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUserDTO } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8089/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUserDTO[]> {
    return this.http.get<AppUserDTO[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<AppUserDTO> {
    return this.http.get<AppUserDTO>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, user);
  }

  getUserImages(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/images`);
  }

  getUserVideos(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/videos`);
  }
}
