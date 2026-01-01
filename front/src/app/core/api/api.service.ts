import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';

export interface ApiError {
  errors?: string[];
  message?: string;
  [key: string]: string | string[] | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = '/api';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`, 
      body,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}${endpoint}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}${endpoint}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}

