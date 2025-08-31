// address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = '/api/address';

  constructor(private http: HttpClient) { }

  getAddressByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  saveAddress(userId: number, address: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${userId}`, address);
  }

  updateAddress(id: number, userId: number, address: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/user/${userId}`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}