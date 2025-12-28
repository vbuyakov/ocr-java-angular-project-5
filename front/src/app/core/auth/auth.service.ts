import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY  = 'auth-token';

  isAuthenticated() : boolean {
      return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
  }

}
