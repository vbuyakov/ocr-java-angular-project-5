import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { LoginPage } from './login-page';
import { AuthApiService } from '../../auth-api.service';
import { AuthService } from '@core/auth/auth.service';
import { ToastService } from '@shared/services/toast.service';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let httpMock: HttpTestingController;
  let authApiService: AuthApiService;
  let authService: AuthService;
  let router: Router;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule, FormInputComponent],
      providers: [
        provideRouter([
          { path: 'articles', component: {} as unknown },
          { path: 'auth/login', component: {} as unknown },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authApiService = TestBed.inject(AuthApiService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('login')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should initialize form with required validators', () => {
      const loginControl = component.loginForm.get('login');
      const passwordControl = component.loginForm.get('password');

      expect(loginControl?.hasError('required')).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should initialize form with maxLength validators', () => {
      const loginControl = component.loginForm.get('login');
      const passwordControl = component.loginForm.get('password');

      // Set values exceeding maxLength
      loginControl?.setValue('a'.repeat(256));
      passwordControl?.setValue('a'.repeat(256));

      expect(loginControl?.hasError('maxlength')).toBe(true);
      expect(passwordControl?.hasError('maxlength')).toBe(true);
    });

    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting()).toBe(false);
    });

    it('should initialize fieldErrors as empty object', () => {
      expect(component.fieldErrors()).toEqual({});
    });

    it('should initialize generalErrors as empty array', () => {
      expect(component.generalErrors()).toEqual([]);
    });
  });

  describe('Form Validation - Login Field', () => {
    it('should mark login as invalid when empty', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('');
      loginControl?.markAsTouched();

      expect(loginControl?.invalid).toBe(true);
      expect(loginControl?.hasError('required')).toBe(true);
    });

    it('should mark login as valid when filled', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('testuser');
      loginControl?.markAsTouched();

      expect(loginControl?.valid).toBe(true);
    });

    it('should accept valid login values', () => {
      const loginControl = component.loginForm.get('login');
      const validLogins = ['user@example.com', 'testuser', 'user123'];

      validLogins.forEach((login) => {
        loginControl?.setValue(login);
        expect(loginControl?.valid).toBe(true);
      });
    });

    it('should reject login exceeding 255 characters', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('a'.repeat(256));

      expect(loginControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept login with exactly 255 characters', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('a'.repeat(255));

      expect(loginControl?.valid).toBe(true);
    });

    it('should trim whitespace from login value on submit', () => {
      const loginControl = component.loginForm.get('login');
      const passwordControl = component.loginForm.get('password');

      loginControl?.setValue('  testuser  ');
      passwordControl?.setValue('password123');

      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.body).toEqual({
        login: 'testuser',
        password: 'password123',
      });
    });
  });

  describe('Form Validation - Password Field', () => {
    it('should mark password as invalid when empty', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.invalid).toBe(true);
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should mark password as valid when filled', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password123');
      passwordControl?.markAsTouched();

      expect(passwordControl?.valid).toBe(true);
    });

    it('should reject password exceeding 255 characters', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('a'.repeat(256));

      expect(passwordControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept password with exactly 255 characters', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('a'.repeat(255));

      expect(passwordControl?.valid).toBe(true);
    });
  });

  describe('Form State Management', () => {
    it('should mark form as invalid when both fields are empty', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should mark form as invalid when only login is filled', () => {
      component.loginForm.get('login')?.setValue('testuser');
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should mark form as invalid when only password is filled', () => {
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should mark form as valid when both fields are filled', () => {
      component.loginForm.get('login')?.setValue('testuser');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBe(true);
    });

    it('should update form values correctly', () => {
      component.loginForm.patchValue({
        login: 'newuser',
        password: 'newpassword',
      });

      expect(component.loginForm.get('login')?.value).toBe('newuser');
      expect(component.loginForm.get('password')?.value).toBe('newpassword');
    });
  });

  describe('getFieldError', () => {
    it('should return undefined for valid untouched field', () => {
      const error = component.getFieldError('login');
      expect(error).toBeUndefined();
    });

    it('should return required error for empty touched field', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.markAsTouched();

      const error = component.getFieldError('login');
      expect(error).toBe('Ce champ est requis');
    });

    it('should return maxlength error for field exceeding max length', () => {
      const loginControl = component.loginForm.get('login');
      loginControl?.setValue('a'.repeat(256));
      loginControl?.markAsTouched();
      loginControl?.markAsDirty();

      const error = component.getFieldError('login');
      expect(error).toContain('Longueur du champ supérieure à 255 caractères');
    });

    it('should return server field error when present', () => {
      component.fieldErrors.set({ login: 'Server error message' });

      const error = component.getFieldError('login');
      expect(error).toBe('Server error message');
    });

    it('should prioritize server error over validation error', () => {
      component.fieldErrors.set({ login: 'Server error message' });
      const loginControl = component.loginForm.get('login');
      loginControl?.markAsTouched();

      const error = component.getFieldError('login');
      expect(error).toBe('Server error message');
    });
  });

  describe('getGeneralErrors', () => {
    it('should return empty array when no general errors', () => {
      expect(component.getGeneralErrors()).toEqual([]);
    });

    it('should return general errors when set', () => {
      component.generalErrors.set(['Error 1', 'Error 2']);
      expect(component.getGeneralErrors()).toEqual(['Error 1', 'Error 2']);
    });
  });

  describe('onSubmit - Success Cases', () => {
    it('should not submit when form is invalid', () => {
      const loginSpy = vi.spyOn(authApiService, 'login');

      component.onSubmit();

      expect(loginSpy).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should not submit when already submitting', () => {
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });
      component.isSubmitting.set(true);

      const loginSpy = vi.spyOn(authApiService, 'login');

      component.onSubmit();

      expect(loginSpy).not.toHaveBeenCalled();
    });

    it('should submit form with correct values', () => {
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        login: 'testuser',
        password: 'password123',
      });
    });

    it('should set isSubmitting to true during submission', () => {
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(true);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: 'test-token' });
    });

    it('should clear field errors on submit', () => {
      component.fieldErrors.set({ login: 'Previous error' });
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });

      component.onSubmit();

      expect(component.fieldErrors()).toEqual({});
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: 'test-token' });
    });

    it('should clear general errors on submit', () => {
      component.generalErrors.set(['Previous error']);
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });

      component.onSubmit();

      expect(component.generalErrors()).toEqual([]);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: 'test-token' });
    });

    it('should handle successful login', () => {
      const loginSpy = vi.spyOn(authService, 'login');
      const toastSpy = vi.spyOn(toastService, 'show');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: 'test-token' });

      expect(loginSpy).toHaveBeenCalledWith('test-token');
      expect(toastSpy).toHaveBeenCalledWith('Connexion réussie !', 'success', 3000);
      expect(navigateSpy).toHaveBeenCalledWith(['/articles']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should trim login value before submitting', () => {
      component.loginForm.patchValue({
        login: '  testuser  ',
        password: 'password123',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.body.login).toBe('testuser');
      req.flush({ token: 'test-token' });
    });

    it('should not trim password value', () => {
      component.loginForm.patchValue({
        login: 'testuser',
        password: '  password123  ',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.body.password).toBe('  password123  ');
      req.flush({ token: 'test-token' });
    });
  });

  describe('onSubmit - Error Cases', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        login: 'testuser',
        password: 'password123',
      });
    });

    it('should handle 400 validation errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(
        { login: 'Invalid login', password: 'Invalid password' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(component.fieldErrors()).toEqual({
        login: 'Invalid login',
        password: 'Invalid password',
      });
      expect(component.generalErrors()).toEqual([]);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle 400 errors with message', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(
        { message: 'General error message', login: 'Field error' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(component.fieldErrors()).toEqual({ login: 'Field error' });
      expect(component.generalErrors()).toEqual(['General error message']);
    });

    it('should handle 409 conflict errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(
        { errors: ['Error 1', 'Error 2'] },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.generalErrors()).toEqual(['Error 1', 'Error 2']);
      expect(component.fieldErrors()).toEqual({});
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle other error statuses', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(component.generalErrors()).toEqual(['Server error']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle errors without message', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });

      expect(component.generalErrors()).toEqual(['Une erreur est survenue']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset isSubmitting on error', () => {
      component.onSubmit();
      expect(component.isSubmitting()).toBe(true);

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Form Value Deep Testing', () => {
    it('should preserve exact form values', () => {
      const testCases = [
        { login: 'user@example.com', password: 'Pass123!' },
        { login: 'testuser', password: 'AnotherPass456@' },
        { login: 'admin', password: 'AdminPass789#' },
      ];

      testCases.forEach((testCase) => {
        component.loginForm.patchValue(testCase);
        expect(component.loginForm.get('login')?.value).toBe(testCase.login);
        expect(component.loginForm.get('password')?.value).toBe(testCase.password);
      });
    });

    it('should handle special characters in login', () => {
      const specialLogins = ['user+tag@example.com', 'user.name@example.com', 'user_name'];

      specialLogins.forEach((login) => {
        component.loginForm.get('login')?.setValue(login);
        expect(component.loginForm.get('login')?.value).toBe(login);
      });
    });

    it('should handle unicode characters in form values', () => {
      component.loginForm.patchValue({
        login: '用户@example.com',
        password: '密码123!',
      });

      expect(component.loginForm.get('login')?.value).toBe('用户@example.com');
      expect(component.loginForm.get('password')?.value).toBe('密码123!');
    });

    it('should handle very long valid values', () => {
      const longLogin = 'a'.repeat(255);
      const longPassword = 'b'.repeat(255);

      component.loginForm.patchValue({
        login: longLogin,
        password: longPassword,
      });

      expect(component.loginForm.get('login')?.value).toBe(longLogin);
      expect(component.loginForm.get('password')?.value).toBe(longPassword);
      expect(component.loginForm.valid).toBe(true);
    });

    it('should maintain form state after multiple updates', () => {
      component.loginForm.get('login')?.setValue('initial');
      component.loginForm.get('password')?.setValue('initial');

      component.loginForm.get('login')?.setValue('updated');
      component.loginForm.get('password')?.setValue('updated');

      expect(component.loginForm.get('login')?.value).toBe('updated');
      expect(component.loginForm.get('password')?.value).toBe('updated');
    });
  });
});
