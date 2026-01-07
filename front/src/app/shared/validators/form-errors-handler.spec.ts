import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { handleServerError, getFieldError } from './form-errors-handler';
import { passwordValidator } from './password.validator';

describe('handleServerError', () => {
  describe('400 Bad Request - Validation Errors', () => {
    it('should handle field errors in 400 response', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          login: 'Invalid login',
          password: 'Invalid password',
        },
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({
        login: 'Invalid login',
        password: 'Invalid password',
      });
      expect(result.generalErrors).toBeUndefined();
    });

    it('should handle single field error', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          email: 'Email is required',
        },
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({
        email: 'Email is required',
      });
    });

    it('should exclude errors and message keys from field errors', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          login: 'Invalid login',
          errors: ['General error'],
          message: 'General message',
        },
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({
        login: 'Invalid login',
      });
      expect(result.fieldErrors?.['errors']).toBeUndefined();
      expect(result.fieldErrors?.['message']).toBeUndefined();
    });

    it('should include general message in generalErrors when present', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          login: 'Invalid login',
          message: 'General error message',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['General error message']);
      expect(result.fieldErrors).toEqual({
        login: 'Invalid login',
      });
    });

    it('should handle empty error object', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {},
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({});
      expect(result.generalErrors).toBeUndefined();
    });

    it('should handle error with only message', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'General error message',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['General error message']);
      expect(result.fieldErrors).toEqual({});
    });
  });

  describe('409 Conflict Errors', () => {
    it('should handle 409 conflict errors with errors array', () => {
      const error = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: {
          errors: ['Error 1', 'Error 2', 'Error 3'],
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Error 1', 'Error 2', 'Error 3']);
      expect(result.fieldErrors).toBeUndefined();
    });

    it('should handle 409 with single error', () => {
      const error = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: {
          errors: ['Single error'],
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Single error']);
    });

    it('should handle 409 with empty errors array', () => {
      const error = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: {
          errors: [],
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual([]);
    });
  });

  describe('Other Error Statuses', () => {
    it('should handle 500 error with message', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: {
          message: 'Server error occurred',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Server error occurred']);
      expect(result.fieldErrors).toBeUndefined();
    });

    it('should handle 401 error with message', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: {
          message: 'Unauthorized access',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Unauthorized access']);
    });

    it('should handle 404 error with message', () => {
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: {
          message: 'Resource not found',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Resource not found']);
    });

    it('should handle error without message', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: {},
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Une erreur est survenue']);
    });

    it('should handle error with null error object', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: null,
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Une erreur est survenue']);
    });

    it('should handle error with undefined error object', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['Une erreur est survenue']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle error with numeric field names', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          '0': 'First error',
          '1': 'Second error',
        },
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({
        '0': 'First error',
        '1': 'Second error',
      });
    });

    it('should handle error with special characters in field names', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          'field-name': 'Error with dash',
          'field_name': 'Error with underscore',
        },
      });

      const result = handleServerError(error);

      expect(result.fieldErrors).toEqual({
        'field-name': 'Error with dash',
        'field_name': 'Error with underscore',
      });
    });

    it('should handle error with unicode in error messages', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: '错误消息',
          field: '字段错误',
        },
      });

      const result = handleServerError(error);

      expect(result.generalErrors).toEqual(['错误消息']);
      expect(result.fieldErrors).toEqual({
        field: '字段错误',
      });
    });
  });
});

describe('getFieldError', () => {
  let form: FormGroup;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
    form = formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidator()], // Remove required to test password validator independently
      optional: [''],
    });
  });

  describe('Untouched/Unchanged Fields', () => {
    it('should return undefined for untouched field', () => {
      const error = getFieldError(form, 'username');
      expect(error).toBeUndefined();
    });

    it('should return undefined for unchanged field', () => {
      const error = getFieldError(form, 'username');
      expect(error).toBeUndefined();
    });

    it('should return undefined for valid untouched field', () => {
      form.get('username')?.setValue('valid');
      const error = getFieldError(form, 'username');
      expect(error).toBeUndefined();
    });
  });

  describe('Required Validation', () => {
    it('should return required error for empty touched field', () => {
      const control = form.get('username');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'username');
      expect(error).toBe('Ce champ est requis');
    });

    it('should return required error for empty dirty field', () => {
      const control = form.get('username');
      control?.markAsDirty();

      const error = getFieldError(form, 'username');
      expect(error).toBe('Ce champ est requis');
    });

    it('should not return error for untouched required field', () => {
      const error = getFieldError(form, 'username');
      expect(error).toBeUndefined();
    });
  });

  describe('Email Validation', () => {
    it('should return email error for invalid email', () => {
      const control = form.get('email');
      control?.setValue('invalid-email');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'email');
      expect(error).toBe('Email invalide');
    });

    it('should return required error for empty email when touched', () => {
      const control = form.get('email');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'email');
      expect(error).toBe('Ce champ est requis');
    });

    it('should return undefined for valid email', () => {
      const control = form.get('email');
      control?.setValue('valid@example.com');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'email');
      expect(error).toBeUndefined();
    });

    it('should prioritize required over email error', () => {
      const control = form.get('email');
      control?.setValue('');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'email');
      expect(error).toBe('Ce champ est requis');
    });
  });

  describe('MaxLength Validation', () => {
    beforeEach(() => {
      form = formBuilder.group({
        field: ['', [Validators.required, Validators.maxLength(10)]],
      });
    });

    it('should return maxlength error message', () => {
      const control = form.get('field');
      control?.setValue('a'.repeat(11));
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'field');
      expect(error).toContain('Longueur du champ supérieure à 10 caractères');
      expect(error).toContain('(11)');
    });

    it('should include actual length in error message', () => {
      const control = form.get('field');
      control?.setValue('a'.repeat(15));
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'field');
      expect(error).toContain('(15)');
    });

    it('should not return error for valid length', () => {
      const control = form.get('field');
      control?.setValue('a'.repeat(10));
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'field');
      expect(error).toBeUndefined();
    });
  });

  describe('Password Validation', () => {
    it('should return password error for invalid password', () => {
      const control = form.get('password');
      control?.setValue('weak');
      control?.updateValueAndValidity();
      control?.markAsTouched();
      control?.markAsDirty();
      
      // Verify the control has password error
      expect(control?.hasError('password')).toBe(true);
      expect(control?.invalid).toBe(true);

      const error = getFieldError(form, 'password');
      // Password validator should return an error message
      expect(error).toBeDefined();
      expect(error).toContain('mot de passe');
    });

    it('should return minLength password error', () => {
      const control = form.get('password');
      control?.setValue('short');
      control?.updateValueAndValidity();
      control?.markAsTouched();
      control?.markAsDirty();
      
      // Verify the control has password error with minLength
      expect(control?.hasError('password')).toBe(true);
      const passwordErrors = control?.getError('password');
      expect(passwordErrors?.['minLength']).toBeDefined();

      const error = getFieldError(form, 'password');
      // 'short' is 5 characters, less than 8, so should return minLength error
      expect(error).toBe('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should return undefined for valid password', () => {
      const control = form.get('password');
      control?.setValue('ValidPass1!');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'password');
      expect(error).toBeUndefined();
    });
  });

  describe('Non-existent Fields', () => {
    it('should return undefined for non-existent field', () => {
      const error = getFieldError(form, 'nonexistent');
      expect(error).toBeUndefined();
    });
  });

  describe('Field State Combinations', () => {
    it('should return error only when field is touched or dirty', () => {
      const control = form.get('username');
      // Not touched, not dirty
      expect(getFieldError(form, 'username')).toBeUndefined();

      // Touched but not dirty
      control?.markAsTouched();
      expect(getFieldError(form, 'username')).toBe('Ce champ est requis');

      // Reset and mark as dirty
      control?.markAsUntouched();
      control?.markAsDirty();
      expect(getFieldError(form, 'username')).toBe('Ce champ est requis');
    });

    it('should return error when both touched and dirty', () => {
      const control = form.get('username');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'username');
      expect(error).toBe('Ce champ est requis');
    });
  });

  describe('Multiple Validators', () => {
    beforeEach(() => {
      form = formBuilder.group({
        complex: ['', [Validators.required, Validators.maxLength(5), Validators.email]],
      });
    });

    it('should prioritize required error', () => {
      const control = form.get('complex');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'complex');
      expect(error).toBe('Ce champ est requis');
    });

    it('should show maxlength error when required is satisfied', () => {
      const control = form.get('complex');
      control?.setValue('a'.repeat(6));
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'complex');
      expect(error).toContain('Longueur du champ supérieure à 5 caractères');
    });

    it('should show email error when required and maxlength are satisfied', () => {
      const control = form.get('complex');
      // Set a value that's <= 5 chars (satisfies maxlength) but invalid email
      control?.setValue('test');
      control?.markAsTouched();
      control?.markAsDirty();

      const error = getFieldError(form, 'complex');
      expect(error).toBe('Email invalide');
    });
  });
});

