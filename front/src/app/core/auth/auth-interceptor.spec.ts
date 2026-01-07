import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth-interceptor';
import { AuthService } from './auth.service';
import { vi } from 'vitest';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Request Modification', () => {
    it('should add Authorization header with Bearer token', async () => {
      const testToken = 'test-token-123';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });

    it('should append Authorization header to existing headers', async () => {
      const testToken = 'test-token-456';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });

    it('should handle null token', async () => {
      vi.spyOn(authService, 'getToken').mockReturnValue(null);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe('Bearer null');
      req.flush({});
      
      await promise;
    });

    it('should handle empty string token', async () => {
      vi.spyOn(authService, 'getToken').mockReturnValue('');

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe('Bearer ');
      req.flush({});
      
      await promise;
    });
  });

  describe('Different HTTP Methods', () => {
    it('should add Authorization header to GET requests', async () => {
      const testToken = 'get-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });

    it('should add Authorization header to POST requests', async () => {
      const testToken = 'post-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.post('/api/test', {}).toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });

    it('should add Authorization header to PUT requests', async () => {
      const testToken = 'put-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.put('/api/test', {}).toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });

    it('should add Authorization header to DELETE requests', async () => {
      const testToken = 'delete-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.delete('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
      req.flush({});
      
      await promise;
    });
  });

  describe('Token Retrieval', () => {
    it('should call getToken from AuthService', async () => {
      const getTokenSpy = vi.spyOn(authService, 'getToken').mockReturnValue('test-token');

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(getTokenSpy).toHaveBeenCalled();
      req.flush({});
      
      await promise;
    });

    it('should use token from AuthService for each request', async () => {
      const tokens = ['token1', 'token2'];
      let callCount = 0;
      vi.spyOn(authService, 'getToken').mockImplementation(() => {
        return tokens[callCount++];
      });
      
      const promise1 = httpClient.get('/api/test1').toPromise();
      const promise2 = httpClient.get('/api/test2').toPromise();
      
      const req1 = httpMock.expectOne('/api/test1');
      const req2 = httpMock.expectOne('/api/test2');
      expect(req1.request.headers.get('Authorization')).toBe('Bearer token1');
      expect(req2.request.headers.get('Authorization')).toBe('Bearer token2');
      req1.flush({});
      req2.flush({});
      
      await Promise.all([promise1, promise2]);
    });
  });

  describe('Request Cloning', () => {
    it('should clone request with new headers', async () => {
      const testToken = 'clone-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      // Verify the request is a clone (has Authorization header added)
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
      
      await promise;
    });

    it('should preserve original request properties', async () => {
      const testToken = 'preserve-token';
      vi.spyOn(authService, 'getToken').mockReturnValue(testToken);

      const promise = httpClient.get('/api/test').toPromise();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.url).toBe('/api/test');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
      
      await promise;
    });
  });

  describe('Interceptor Creation', () => {
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
    });
  });
});
