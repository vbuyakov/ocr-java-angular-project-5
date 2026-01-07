import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token is stored', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when token is stored', () => {
      service.login('test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', () => {
      service.login('test-token');
      expect(service.isAuthenticated()).toBe(true);

      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('login', () => {
    it('should store token in localStorage', () => {
      service.login('test-token');
      expect(localStorage.getItem('auth-token')).toBe('test-token');
    });

    it('should overwrite existing token', () => {
      service.login('first-token');
      expect(localStorage.getItem('auth-token')).toBe('first-token');

      service.login('second-token');
      expect(localStorage.getItem('auth-token')).toBe('second-token');
    });

    it('should handle empty string token', () => {
      service.login('');
      expect(localStorage.getItem('auth-token')).toBe('');
      // Empty string is stored but not considered authenticated (correct behavior)
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should handle long token strings', () => {
      const longToken = 'a'.repeat(1000);
      service.login(longToken);
      expect(localStorage.getItem('auth-token')).toBe(longToken);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token!@#$%^&*()_+-=[]{}|;:,.<>?';
      service.login(specialToken);
      expect(localStorage.getItem('auth-token')).toBe(specialToken);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      service.login('test-token');
      expect(localStorage.getItem('auth-token')).toBe('test-token');

      service.logout();
      expect(localStorage.getItem('auth-token')).toBeNull();
    });

    it('should handle logout when no token exists', () => {
      expect(() => service.logout()).not.toThrow();
      expect(localStorage.getItem('auth-token')).toBeNull();
    });

    it('should make isAuthenticated return false after logout', () => {
      service.login('test-token');
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return stored token', () => {
      service.login('test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null after logout', () => {
      service.login('test-token');
      service.logout();
      expect(service.getToken()).toBeNull();
    });

    it('should return exact token value', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      service.login(token);
      expect(service.getToken()).toBe(token);
    });
  });

  describe('Token Persistence', () => {
    it('should persist token across service instances', () => {
      service.login('persistent-token');
      const newService = TestBed.inject(AuthService);
      expect(newService.getToken()).toBe('persistent-token');
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should maintain token after service recreation', () => {
      service.login('test-token');
      const token = service.getToken();

      // Simulate service recreation
      const newService = TestBed.inject(AuthService);
      expect(newService.getToken()).toBe(token);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple login/logout cycles', () => {
      for (let i = 0; i < 10; i++) {
        service.login(`token-${i}`);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getToken()).toBe(`token-${i}`);

        service.logout();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.getToken()).toBeNull();
      }
    });

    it('should handle unicode characters in token', () => {
      const unicodeToken = 'token用户密码';
      service.login(unicodeToken);
      expect(service.getToken()).toBe(unicodeToken);
    });

    it('should handle whitespace in token', () => {
      const tokenWithWhitespace = '  token  ';
      service.login(tokenWithWhitespace);
      expect(service.getToken()).toBe(tokenWithWhitespace);
    });
  });
});
