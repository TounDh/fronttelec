import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Srvce } from '../models/srvce.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8085/api/srvces';

  constructor(private http: HttpClient) {}

  createService(service: Omit<Srvce, 'id'>): Observable<Srvce> {
  return this.http.post<Srvce>(this.apiUrl, service);
}

  getAllServices(): Observable<Srvce[]> {
    return this.http.get<Srvce[]>(this.apiUrl);
  }

  getService(id: number): Observable<Srvce> {
    return this.http.get<Srvce>(`${this.apiUrl}/${id}`);
  }

  updateService(id: number, service: Srvce): Observable<Srvce> {
    return this.http.put<Srvce>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}