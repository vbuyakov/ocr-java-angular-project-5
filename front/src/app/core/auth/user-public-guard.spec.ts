import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { userPublicGuard } from './user-public-guard';
import { AuthService } from './auth.service';
import { vi } from 'vitest';

describe('userPublicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userPublicGuard(...guardParameters));

  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'articles', component: {} as unknown },
          { path: 'auth/login', component: {} as unknown },
        ]),
        AuthService,
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('Unauthenticated User', () => {
    it('should allow access when user is not authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result).toBe(true);
    });

    it('should return true for unauthenticated user', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(typeof result === 'boolean' ? result : false).toBe(true);
    });
  });

  describe('Authenticated User', () => {
    it('should redirect to /articles when user is authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      const createUrlTreeSpy = vi.spyOn(router, 'createUrlTree');

      const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(createUrlTreeSpy).toHaveBeenCalledWith(['/articles']);
      expect(result).not.toBe(true);
    });

    it('should return UrlTree to /articles when authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

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
      const isAuthenticatedSpy = vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(isAuthenticatedSpy).toHaveBeenCalled();
    });

    it('should handle multiple calls correctly', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      const result1 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      const result2 = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });
});
