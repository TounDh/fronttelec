import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define interfaces for the response data
interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    phone: string;
    birthdate: string;
  };
  token: string;
}

interface UserData {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  phone: string;
  birthdate: string;
}

interface AuthResponse {
  message: string;
  user: UserData;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/api/auth';
  private userApiUrl = 'http://localhost:8085/api/users'; // Add base URL for user endpoints

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('authToken', response.token);
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
  }

  getCurrentUser(): UserData | null {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return null;

      const parsedUser = JSON.parse(currentUser);
      console.log('Raw parsed user:', parsedUser);

      if (parsedUser && parsedUser.user) {
        return parsedUser.user;
      }

      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // New method to update user in the backend
  updateUser(user: UserData): Observable<UserData> {
    const url = `${this.userApiUrl}/${user.id}`;
    return this.http.put<UserData>(url, user, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`
      }
    }).pipe(
      map(response => {
        // Update localStorage with the response
        localStorage.setItem('currentUser', JSON.stringify(response));
        return response;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  updateCurrentUser(user: any) {
    // Update localStorage only
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}