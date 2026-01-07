import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpErrorResponse, provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { responseInterceptor } from './response-interceptor';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('responseInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => responseInterceptor(req, next));

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([responseInterceptor])),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'error/not-found', component: {} as unknown },
          { path: 'auth/login', component: {} as unknown },
        ]),
        AuthService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Successful Requests', () => {
    it('should pass through successful requests', async () => {
      const testUrl = '/api/test';
      const testData = { message: 'success' };

      const promise = httpClient.get(testUrl).toPromise();

      const req = httpMock.expectOne(testUrl);
      req.flush(testData);
      
      const data = await promise;
      expect(data).toEqual(testData);
    });
  });

  describe('404 Not Found Errors', () => {
    it('should navigate to /error/not-found on 404 error', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(navigateSpy).toHaveBeenCalledWith(['/error/not-found']);
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });
      
      await promise;
    });

    it('should still throw error after navigating on 404', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(navigateSpy).toHaveBeenCalled();
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });
      
      await promise;
    });
  });

  describe('401 Unauthorized Errors', () => {
    it('should logout and navigate to /auth/login on 401 error', async () => {
      const logoutSpy = vi.spyOn(authService, 'logout');
      const navigateSpy = vi.spyOn(router, 'navigate');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(logoutSpy).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      
      await promise;
    });

    it('should still throw error after logout and navigation on 401', async () => {
      const logoutSpy = vi.spyOn(authService, 'logout');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(logoutSpy).toHaveBeenCalled();
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      
      await promise;
    });
  });

  describe('Other Error Statuses', () => {
    it('should pass through 500 errors without navigation', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const logoutSpy = vi.spyOn(authService, 'logout');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(navigateSpy).not.toHaveBeenCalled();
        expect(logoutSpy).not.toHaveBeenCalled();
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
      
      await promise;
    });

    it('should pass through 400 errors without navigation', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const logoutSpy = vi.spyOn(authService, 'logout');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(navigateSpy).not.toHaveBeenCalled();
        expect(logoutSpy).not.toHaveBeenCalled();
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
      
      await promise;
    });

    it('should pass through 403 errors without navigation', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const logoutSpy = vi.spyOn(authService, 'logout');

      const promise = httpClient.get('/api/test').toPromise().catch((error: HttpErrorResponse) => {
        expect(error.status).toBe(403);
        expect(navigateSpy).not.toHaveBeenCalled();
        expect(logoutSpy).not.toHaveBeenCalled();
        return error;
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
      
      await promise;
    });
  });

  describe('Interceptor Creation', () => {
    it('should be created', () => {
      expect(interceptor).toBeTruthy();
    });
  });
});
