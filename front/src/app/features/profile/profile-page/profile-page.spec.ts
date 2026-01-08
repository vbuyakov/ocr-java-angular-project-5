import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { ProfilePage } from './profile-page';
import { UserProfileApiService } from '../user-profile-api.service';
import { ToastService } from '@shared/services/toast.service';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { TopicsList } from '@shared/components/topics-list/topics-list';
import { UserProfileResponseDto } from '../dtos/user-profile-response.dto';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let httpMock: HttpTestingController;
  let userProfileApiService: UserProfileApiService;
  let toastService: ToastService;

  const mockProfile: UserProfileResponseDto = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage, ReactiveFormsModule, FormInputComponent, TopicsList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    userProfileApiService = TestBed.inject(UserProfileApiService);
    toastService = TestBed.inject(ToastService);

    // Load profile
    fixture.detectChanges();
    const profileReq = httpMock.expectOne('/api/user/profile');
    profileReq.flush(mockProfile);
    
    // Mock TopicsList HTTP request (mode is 'subscribed' in profile page)
    const topicsReq = httpMock.expectOne('/api/topics/subscribed');
    topicsReq.flush([]);
    
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
      expect(component.profileForm).toBeDefined();
      // After profile is loaded, form should have profile values
      expect(component.profileForm.get('username')?.value).toBe('testuser');
      expect(component.profileForm.get('email')?.value).toBe('test@example.com');
      expect(component.profileForm.get('password')?.value).toBe('');
    });

    it('should initialize form with required validators on username and email', () => {
      const usernameControl = component.profileForm.get('username');
      const emailControl = component.profileForm.get('email');
      const passwordControl = component.profileForm.get('password');

      // After profile is loaded, fields have values so required is satisfied
      expect(usernameControl?.hasError('required')).toBe(false);
      expect(emailControl?.hasError('required')).toBe(false);
      // Password is optional in profile form
      expect(passwordControl?.hasError('required')).toBe(false);
    });

    it('should initialize form with email validator on email field', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should initialize form with maxLength validators', () => {
      const usernameControl = component.profileForm.get('username');
      const emailControl = component.profileForm.get('email');
      const passwordControl = component.profileForm.get('password');

      usernameControl?.setValue('a'.repeat(256));
      emailControl?.setValue('a'.repeat(256));
      passwordControl?.setValue('a'.repeat(256));

      expect(usernameControl?.hasError('maxlength')).toBe(true);
      expect(emailControl?.hasError('maxlength')).toBe(true);
      expect(passwordControl?.hasError('maxlength')).toBe(true);
    });

    it('should initialize form with password validator (optional)', () => {
      const passwordControl = component.profileForm.get('password');
      // Empty password should be valid (optional field)
      expect(passwordControl?.valid).toBe(true);

      // Weak password should be invalid
      passwordControl?.setValue('weak');
      passwordControl?.markAsTouched();
      expect(passwordControl?.hasError('password')).toBe(true);
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

    it('should load user profile on init', () => {
      expect(component.profileForm.get('username')?.value).toBe('testuser');
      expect(component.profileForm.get('email')?.value).toBe('test@example.com');
      expect(component.profileForm.get('password')?.value).toBe('');
    });
  });

  describe('Form Validation - Username Field', () => {
    it('should mark username as invalid when empty', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(usernameControl?.invalid).toBe(true);
      expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should mark username as valid when filled', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('testuser');
      usernameControl?.markAsTouched();

      expect(usernameControl?.valid).toBe(true);
    });

    it('should accept valid username values', () => {
      const usernameControl = component.profileForm.get('username');
      const validUsernames = ['user123', 'test_user', 'user-name', 'User123'];

      validUsernames.forEach((username) => {
        usernameControl?.setValue(username);
        expect(usernameControl?.valid).toBe(true);
      });
    });

    it('should reject username exceeding 255 characters', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('a'.repeat(256));

      expect(usernameControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept username with exactly 255 characters', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('a'.repeat(255));

      expect(usernameControl?.valid).toBe(true);
    });
  });

  describe('Form Validation - Email Field', () => {
    it('should mark email as invalid when empty', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.invalid).toBe(true);
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should mark email as invalid when format is incorrect', () => {
      const emailControl = component.profileForm.get('email');
      const invalidEmails = ['invalid', 'invalid@', '@invalid.com', 'invalid@.com'];

      invalidEmails.forEach((email) => {
        emailControl?.setValue(email);
        emailControl?.markAsTouched();
        expect(emailControl?.hasError('email')).toBe(true);
      });
    });

    it('should mark email as valid when format is correct', () => {
      const emailControl = component.profileForm.get('email');
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        emailControl?.setValue(email);
        emailControl?.markAsTouched();
        expect(emailControl?.valid).toBe(true);
      });
    });

    it('should reject email exceeding 255 characters', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('a'.repeat(250) + '@example.com');

      expect(emailControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Form Validation - Password Field', () => {
    it('should mark password as valid when empty (optional field)', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.valid).toBe(true);
    });

    it('should mark password as invalid when too short', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('Short1!');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('password')).toBe(true);
    });

    it('should mark password as invalid when missing digit', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('NoDigitPass!');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('password')).toBe(true);
    });

    it('should mark password as invalid when missing lowercase', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('NOLOWERCASE123!');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('password')).toBe(true);
    });

    it('should mark password as invalid when missing uppercase', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('nouppercase123!');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('password')).toBe(true);
    });

    it('should mark password as invalid when missing special character', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('NoSpecialChar123');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('password')).toBe(true);
    });

    it('should mark password as valid when all requirements met', () => {
      const passwordControl = component.profileForm.get('password');
      const validPasswords = [
        'ValidPass123!',
        'Another1@Pass',
        'Test#Password2',
        'My$Pass123',
      ];

      validPasswords.forEach((password) => {
        passwordControl?.setValue(password);
        passwordControl?.markAsTouched();
        expect(passwordControl?.valid).toBe(true);
      });
    });

    it('should accept empty password (optional field)', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('');

      expect(passwordControl?.valid).toBe(true);
    });
  });

  describe('Form State Management', () => {
    it('should mark form as invalid when username is empty', () => {
      component.profileForm.get('username')?.setValue('');
      expect(component.profileForm.invalid).toBe(true);
    });

    it('should mark form as invalid when email is empty', () => {
      component.profileForm.get('email')?.setValue('');
      expect(component.profileForm.invalid).toBe(true);
    });

    it('should mark form as invalid when email is invalid', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'invalid-email',
        password: '',
      });
      expect(component.profileForm.invalid).toBe(true);
    });

    it('should mark form as valid when username and email are valid and password is empty', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });
      expect(component.profileForm.valid).toBe(true);
    });

    it('should mark form as valid when all fields including password are valid', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });
      expect(component.profileForm.valid).toBe(true);
    });

    it('should mark form as invalid when password is provided but weak', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      });
      expect(component.profileForm.invalid).toBe(true);
    });

    it('should update form values correctly', () => {
      component.profileForm.patchValue({
        username: 'newuser',
        email: 'new@example.com',
        password: 'NewPass123!',
      });

      expect(component.profileForm.get('username')?.value).toBe('newuser');
      expect(component.profileForm.get('email')?.value).toBe('new@example.com');
      expect(component.profileForm.get('password')?.value).toBe('NewPass123!');
    });
  });

  describe('loadUserProfile', () => {
    it('should load user profile and populate form', () => {
      const newProfile: UserProfileResponseDto = {
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
      };

      component.loadUserProfile();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(newProfile);

      expect(component.profileForm.get('username')?.value).toBe('newuser');
      expect(component.profileForm.get('email')?.value).toBe('new@example.com');
      expect(component.profileForm.get('password')?.value).toBe('');
    });

    it('should set password to empty string when loading profile', () => {
      component.profileForm.get('password')?.setValue('SomePassword123!');

      component.loadUserProfile();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);

      expect(component.profileForm.get('password')?.value).toBe('');
    });

    it('should not emit events when setting form values from profile', () => {
      const usernameSpy = vi.fn();
      component.profileForm.get('username')?.valueChanges.subscribe(usernameSpy);

      component.loadUserProfile();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);

      // Should not emit because emitEvent is false
      expect(usernameSpy).not.toHaveBeenCalled();
    });
  });

  describe('getFieldError', () => {
    it('should return undefined for valid untouched field', () => {
      const error = component.getFieldError('username');
      expect(error).toBeUndefined();
    });

    it('should return required error for empty touched field', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      const error = component.getFieldError('username');
      expect(error).toBe('Ce champ est requis');
    });

    it('should return email error for invalid email', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      emailControl?.markAsDirty();

      const error = component.getFieldError('email');
      expect(error).toBe('Email invalide');
    });

    it('should return password error for weak password', () => {
      const passwordControl = component.profileForm.get('password');
      passwordControl?.setValue('weak');
      passwordControl?.updateValueAndValidity();
      passwordControl?.markAsTouched();
      passwordControl?.markAsDirty();

      const error = component.getFieldError('password');
      expect(error).toBeDefined();
      expect(error).toContain('mot de passe');
    });

    it('should return server field error when present', () => {
      component.fieldErrors.set({ username: 'Server error message' });

      const error = component.getFieldError('username');
      expect(error).toBe('Server error message');
    });

    it('should prioritize server error over validation error', () => {
      component.fieldErrors.set({ email: 'Server error message' });
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      const error = component.getFieldError('email');
      expect(error).toBe('Server error message');
    });
  });

  describe('onSubmit - Success Cases', () => {
    it('should not submit when form is invalid', () => {
      component.profileForm.get('username')?.setValue('');
      const updateSpy = vi.spyOn(userProfileApiService, 'updateProfile');

      component.onSubmit();

      expect(updateSpy).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should not submit when already submitting', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });
      component.isSubmitting.set(true);

      const updateSpy = vi.spyOn(userProfileApiService, 'updateProfile');

      component.onSubmit();

      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should submit form with correct values', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });
    });

    it('should submit form without password when password is empty', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      expect(req.request.method).toBe('PUT');
      // Password should be undefined when empty
      expect(req.request.body.password).toBeUndefined();
    });

    it('should set isSubmitting to true during submission', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(true);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);
    });

    it('should clear field errors on submit', () => {
      component.fieldErrors.set({ username: 'Previous error' });
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });

      component.onSubmit();

      expect(component.fieldErrors()).toEqual({});
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);
    });

    it('should clear general errors on submit', () => {
      component.generalErrors.set(['Previous error']);
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });

      component.onSubmit();

      expect(component.generalErrors()).toEqual([]);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);
    });

    it('should handle successful profile update', () => {
      const toastSpy = vi.spyOn(toastService, 'show');
      const updatedProfile: UserProfileResponseDto = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
      };

      component.profileForm.patchValue({
        username: 'updateduser',
        email: 'updated@example.com',
        password: '',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(updatedProfile);

      expect(toastSpy).toHaveBeenCalledWith('Votre profil a bien été mis à jour !', 'success', 3000);
      expect(component.profileForm.get('username')?.value).toBe('updateduser');
      expect(component.profileForm.get('email')?.value).toBe('updated@example.com');
      expect(component.profileForm.get('password')?.value).toBe('');
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset password field after successful update', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(mockProfile);

      expect(component.profileForm.get('password')?.value).toBe('');
    });
  });

  describe('onSubmit - Error Cases', () => {
    beforeEach(() => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });
    });

    it('should handle 400 validation errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(
        { username: 'Username taken', email: 'Email already exists' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(component.fieldErrors()).toEqual({
        username: 'Username taken',
        email: 'Email already exists',
      });
      expect(component.generalErrors()).toEqual([]);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle 409 conflict errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(
        { errors: ['Username already exists'] },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.generalErrors()).toEqual(['Username already exists']);
      expect(component.fieldErrors()).toEqual({});
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle other error statuses', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/user/profile');
      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(component.generalErrors()).toEqual(['Server error']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset isSubmitting on error', () => {
      component.onSubmit();
      expect(component.isSubmitting()).toBe(true);

      const req = httpMock.expectOne('/api/user/profile');
      req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Form Value Deep Testing', () => {
    it('should preserve exact form values', () => {
      const testCases = [
        { username: 'user123', email: 'user@example.com', password: '' },
        { username: 'test_user', email: 'test@test.com', password: 'ValidPass123!' },
        { username: 'admin', email: 'admin@admin.com', password: 'Admin#Pass2' },
      ];

      testCases.forEach((testCase) => {
        component.profileForm.patchValue(testCase);
        expect(component.profileForm.get('username')?.value).toBe(testCase.username);
        expect(component.profileForm.get('email')?.value).toBe(testCase.email);
        expect(component.profileForm.get('password')?.value).toBe(testCase.password);
      });
    });

    it('should handle special characters in username', () => {
      const specialUsernames = ['user_name', 'user-name', 'user.name', 'user+tag'];

      specialUsernames.forEach((username) => {
        component.profileForm.get('username')?.setValue(username);
        expect(component.profileForm.get('username')?.value).toBe(username);
      });
    });

    it('should handle complex email formats', () => {
      const complexEmails = [
        'user+tag@example.com',
        'user.name@example.com',
        'user_name@example.co.uk',
        'test123@test-domain.com',
      ];

      complexEmails.forEach((email) => {
        component.profileForm.get('email')?.setValue(email);
        expect(component.profileForm.get('email')?.value).toBe(email);
      });
    });

    it('should handle unicode characters in form values', () => {
      component.profileForm.patchValue({
        username: '用户',
        email: 'test@example.com',
        password: '密码123!',
      });

      expect(component.profileForm.get('username')?.value).toBe('用户');
      expect(component.profileForm.get('password')?.value).toBe('密码123!');
    });

    it('should handle very long valid values', () => {
      const longUsername = 'a'.repeat(255);
      const longEmail = 'a'.repeat(240) + '@example.com';
      const longPassword = 'A'.repeat(247) + 'a1!';

      component.profileForm.patchValue({
        username: longUsername,
        email: longEmail,
        password: longPassword,
      });

      expect(component.profileForm.get('username')?.value).toBe(longUsername);
      expect(component.profileForm.get('email')?.value).toBe(longEmail);
      expect(component.profileForm.get('password')?.value).toBe(longPassword);
    });

    it('should maintain form state after multiple updates', () => {
      component.profileForm.patchValue({
        username: 'initial',
        email: 'initial@example.com',
        password: 'Initial1!',
      });

      component.profileForm.patchValue({
        username: 'updated',
        email: 'updated@example.com',
        password: 'Updated2@',
      });

      expect(component.profileForm.get('username')?.value).toBe('updated');
      expect(component.profileForm.get('email')?.value).toBe('updated@example.com');
      expect(component.profileForm.get('password')?.value).toBe('Updated2@');
    });

    it('should handle empty password correctly', () => {
      component.profileForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
      });

      expect(component.profileForm.get('password')?.value).toBe('');
      expect(component.profileForm.valid).toBe(true);
    });
  });
});
