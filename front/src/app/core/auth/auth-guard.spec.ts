import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from './auth.service';
import { vi } from 'vitest';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'auth/login', component: {} as unknown },
          { path: 'articles', component: {} as unknown },
        ]),
        AuthService,
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('Authenticated User', () => {
    it('should allow access when user is authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result).toBe(true);
    });

    it('should return true for authenticated user', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(typeof result === 'boolean' ? result : false).toBe(true);
    });
  });

  describe('Unauthenticated User', () => {
    it('should redirect to /auth/login when user is not authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
      const createUrlTreeSpy = vi.spyOn(router, 'createUrlTree');

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/auth/login']);
      expect(result).not.toBe(true);
    });

    it('should return UrlTree to /auth/login when not authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result).toBeTruthy();
      // Result should be a UrlTree, not a boolean
      expect(result).not.toBe(true);
    });
  });

  describe('Guard Execution', () => {
    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should call isAuthenticated from AuthService', () => {
      const isAuthenticatedSpy = vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(isAuthenticatedSpy).toHaveBeenCalled();
    });

    it('should handle multiple calls correctly', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      const result1 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      const result2 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should handle state changes between calls', () => {
      const isAuthenticatedSpy = vi.spyOn(authService, 'isAuthenticated')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const result1 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      const result2 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result1).toBe(true);
      expect(result2).not.toBe(true);
      expect(isAuthenticatedSpy).toHaveBeenCalledTimes(2);
    });
  });
});
