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

  constructor(private http: HttpClient) { }

  // auth.service.ts - FIX THE LOGIN METHOD
// In auth.service.ts
login(credentials: { email: string; password: string }): Observable<AuthResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    map(response => {
      if (response && response.token) {
        // Store ONLY the user object, not the entire response
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
    // Remove user from local storage to log user out
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
    
    // Check if we have the nested structure
    if (parsedUser && parsedUser.user) {
      return parsedUser.user; // Return the nested user object
    }
    
    return parsedUser; // Return flat user object
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}




  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Optional: Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Optional: Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
 
  updateCurrentUser(user: any) {
  // Update the current user in the service
  this.getCurrentUser = user;
  // You might also want to update localStorage here if that's your main storage method
  localStorage.setItem('currentUser', JSON.stringify(user));
}
}