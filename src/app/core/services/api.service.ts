import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TelecomUser } from '../models/telecom-user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8085/api/users'; // Matches backend port

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<TelecomUser[]> {
    return this.http.get<TelecomUser[]>(this.baseUrl);
  }

  getUser(id: number): Observable<TelecomUser> {
    return this.http.get<TelecomUser>(`${this.baseUrl}/${id}`);
  }

  createUser(user: TelecomUser): Observable<TelecomUser> {
    return this.http.post<TelecomUser>(this.baseUrl, user);
  }

  updateUser(id: number, user: TelecomUser): Observable<TelecomUser> {
    return this.http.put<TelecomUser>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}