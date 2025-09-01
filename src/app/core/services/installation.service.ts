import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Installation } from '../models/installation.model';

@Injectable({
  providedIn: 'root'
})
export class InstallationService {
  private apiUrl = 'http://localhost:8085/api/installations'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  // Get all installations
  getAllInstallations(): Observable<Installation[]> {
    return this.http.get<Installation[]>(this.apiUrl);
  }

  // Get installations by application IDs (for unscheduled paid applications)
  getInstallationsByApplicationIds(applicationIds: number[]): Observable<Installation[]> {
    return this.http.post<Installation[]>(`${this.apiUrl}/by-applications`, applicationIds);
  }
}