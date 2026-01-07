import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('POST Requests', () => {
    it('should make POST request to correct endpoint', () => {
      const testData = { name: 'Test', value: 123 };
      const mockResponse = { id: 1, ...testData };

      service.post('/test', testData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testData);
      req.flush(mockResponse);
    });

    it('should include base URL in POST request', () => {
      service.post('/endpoint', {}).subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.url).toBe('/api/endpoint');
      req.flush({});
    });

    it('should send request body in POST', () => {
      const body = { username: 'test', password: 'pass123' };
      service.post('/auth/login', body).subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });

    it('should handle POST with empty body', () => {
      service.post('/endpoint', {}).subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.body).toEqual({});
      req.flush({});
    });

    it('should handle POST with null body', () => {
      service.post('/endpoint', null).subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.body).toBeNull();
      req.flush({});
    });

    it('should handle POST with array body', () => {
      const body = [1, 2, 3];
      service.post('/endpoint', body).subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });

    it('should return typed response from POST', () => {
      interface ResponseType {
        id: number;
        name: string;
      }

      const mockResponse: ResponseType = { id: 1, name: 'Test' };

      service.post<ResponseType>('/test', {}).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBe(1);
        expect(response.name).toBe('Test');
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(mockResponse);
    });
  });

  describe('GET Requests', () => {
    it('should make GET request to correct endpoint', () => {
      const mockResponse = { data: 'test' };

      service.get('/test').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include base URL in GET request', () => {
      service.get('/endpoint').subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.url).toBe('/api/endpoint');
      req.flush({});
    });

    it('should return typed response from GET', () => {
      interface ResponseType {
        items: string[];
      }

      const mockResponse: ResponseType = { items: ['item1', 'item2'] };

      service.get<ResponseType>('/test').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.items).toHaveLength(2);
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(mockResponse);
    });

    it('should handle GET with array response', () => {
      const mockResponse = [{ id: 1 }, { id: 2 }];

      service.get('/items').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(Array.isArray(response)).toBe(true);
      });

      const req = httpMock.expectOne('/api/items');
      req.flush(mockResponse);
    });
  });

  describe('PUT Requests', () => {
    it('should make PUT request to correct endpoint', () => {
      const testData = { id: 1, name: 'Updated' };
      const mockResponse = testData;

      service.put('/test/1', testData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(testData);
      req.flush(mockResponse);
    });

    it('should include base URL in PUT request', () => {
      service.put('/endpoint', {}).subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.url).toBe('/api/endpoint');
      req.flush({});
    });

    it('should send request body in PUT', () => {
      const body = { username: 'updated', email: 'new@example.com' };
      service.put('/user/1', body).subscribe();

      const req = httpMock.expectOne('/api/user/1');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });
  });

  describe('DELETE Requests', () => {
    it('should make DELETE request to correct endpoint', () => {
      service.delete('/test/1').subscribe((response) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should include base URL in DELETE request', () => {
      service.delete('/endpoint').subscribe();

      const req = httpMock.expectOne('/api/endpoint');
      expect(req.request.url).toBe('/api/endpoint');
      req.flush({});
    });

    it('should return typed response from DELETE', () => {
      interface ResponseType {
        success: boolean;
      }

      const mockResponse: ResponseType = { success: true };

      service.delete<ResponseType>('/test/1').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne('/api/test/1');
      req.flush(mockResponse);
    });
  });

  describe('Endpoint Handling', () => {
    it('should handle endpoints with query parameters', () => {
      service.get('/test?param=value').subscribe();

      const req = httpMock.expectOne('/api/test?param=value');
      expect(req.request.url).toBe('/api/test?param=value');
      req.flush({});
    });

    it('should handle nested endpoints', () => {
      service.get('/users/1/posts/2').subscribe();

      const req = httpMock.expectOne('/api/users/1/posts/2');
      expect(req.request.url).toBe('/api/users/1/posts/2');
      req.flush({});
    });

    it('should handle endpoints starting with slash', () => {
      service.get('/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.url).toBe('/api/test');
      req.flush({});
    });
  });

  describe('Request Body Types', () => {
    it('should handle object body', () => {
      const body = { key: 'value', number: 123 };
      service.post('/test', body).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.body).toEqual(body);
      req.flush({});
    });

    it('should handle string body', () => {
      const body = 'string body';
      service.post('/test', body).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.body).toBe(body);
      req.flush({});
    });

    it('should handle number body', () => {
      const body = 123;
      service.post('/test', body).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.body).toBe(body);
      req.flush({});
    });

    it('should handle boolean body', () => {
      const body = true;
      service.post('/test', body).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.body).toBe(body);
      req.flush({});
    });

    it('should handle FormData body', () => {
      const body = new FormData();
      body.append('file', new Blob(['content']), 'file.txt');
      service.post('/upload', body).subscribe();

      const req = httpMock.expectOne('/api/upload');
      expect(req.request.body).toBeInstanceOf(FormData);
      req.flush({});
    });
  });

  describe('Response Types', () => {
    it('should handle object response', () => {
      const response = { id: 1, name: 'Test' };
      service.get('/test').subscribe((data) => {
        expect(data).toEqual(response);
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(response);
    });

    it('should handle array response', () => {
      const response = [{ id: 1 }, { id: 2 }];
      service.get('/test').subscribe((data) => {
        expect(data).toEqual(response);
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(response);
    });

    it('should handle string response', () => {
      const response = 'success';
      service.get('/test').subscribe((data) => {
        expect(data).toBe(response);
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(response);
    });

    it('should handle null response', () => {
      service.get('/test').subscribe((data) => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(null);
    });
  });
});

