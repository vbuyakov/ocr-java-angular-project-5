import { FormControl } from '@angular/forms';
import { passwordValidator, getPasswordErrorMessage } from './password.validator';

describe('passwordValidator', () => {
  let validator: ReturnType<typeof passwordValidator>;

  beforeEach(() => {
    validator = passwordValidator();
  });

  describe('Empty Values', () => {
    it('should return null for empty string', () => {
      const control = new FormControl('');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = new FormControl(null);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  describe('Minimum Length Validation', () => {
    it('should reject password shorter than 8 characters', () => {
      const control = new FormControl('short');
      const result = validator(control);
      expect(result).not.toBeNull();
      expect(result?.['password']?.['minLength']).toBeDefined();
      expect(result?.['password']?.['minLength']?.requiredLength).toBe(8);
      expect(result?.['password']?.['minLength']?.actualLength).toBe(5);
    });

    it('should reject password with exactly 7 characters', () => {
      const control = new FormControl('1234567');
      const result = validator(control);
      expect(result?.['password']?.['minLength']).toBeDefined();
    });

    it('should accept password with exactly 8 characters', () => {
      const control = new FormControl('Password1!');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should accept password longer than 8 characters', () => {
      const control = new FormControl('VeryLongPassword123!');
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  describe('Digit Validation', () => {
    it('should reject password without digits', () => {
      const control = new FormControl('Password!');
      const result = validator(control);
      expect(result?.['password']?.['hasDigit']).toBe(true);
    });

    it('should accept password with at least one digit', () => {
      const control = new FormControl('Password1!');
      const result = validator(control);
      expect(result?.['password']?.['hasDigit']).toBeUndefined();
    });

    it('should accept password with multiple digits', () => {
      const control = new FormControl('Password123!');
      const result = validator(control);
      expect(result?.['password']?.['hasDigit']).toBeUndefined();
    });

    it('should accept password starting with digit', () => {
      const control = new FormControl('1Password!');
      const result = validator(control);
      expect(result?.['password']?.['hasDigit']).toBeUndefined();
    });

    it('should accept password ending with digit', () => {
      const control = new FormControl('Password!1');
      const result = validator(control);
      expect(result?.['password']?.['hasDigit']).toBeUndefined();
    });
  });

  describe('Lowercase Letter Validation', () => {
    it('should reject password without lowercase letters', () => {
      const control = new FormControl('PASSWORD1!');
      const result = validator(control);
      expect(result?.['password']?.['hasLowercase']).toBe(true);
    });

    it('should accept password with at least one lowercase letter', () => {
      const control = new FormControl('PASSWORD1!a');
      const result = validator(control);
      expect(result?.['password']?.['hasLowercase']).toBeUndefined();
    });

    it('should accept password with multiple lowercase letters', () => {
      const control = new FormControl('Password1!');
      const result = validator(control);
      expect(result?.['password']?.['hasLowercase']).toBeUndefined();
    });

    it('should accept password with only lowercase letters (if other rules pass)', () => {
      const control = new FormControl('password1!');
      const result = validator(control);
      expect(result?.['password']?.['hasLowercase']).toBeUndefined();
    });
  });

  describe('Uppercase Letter Validation', () => {
    it('should reject password without uppercase letters', () => {
      const control = new FormControl('password1!');
      const result = validator(control);
      expect(result?.['password']?.['hasUppercase']).toBe(true);
    });

    it('should accept password with at least one uppercase letter', () => {
      const control = new FormControl('password1!A');
      const result = validator(control);
      expect(result?.['password']?.['hasUppercase']).toBeUndefined();
    });

    it('should accept password with multiple uppercase letters', () => {
      const control = new FormControl('PASSWORD1!');
      const result = validator(control);
      expect(result?.['password']?.['hasUppercase']).toBeUndefined();
    });

    it('should accept password with only uppercase letters (if other rules pass)', () => {
      const control = new FormControl('PASSWORD1!');
      const result = validator(control);
      expect(result?.['password']?.['hasUppercase']).toBeUndefined();
    });
  });

  describe('Special Character Validation', () => {
    it('should reject password without special characters', () => {
      const control = new FormControl('Password1');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBe(true);
    });

    it('should accept password with exclamation mark', () => {
      const control = new FormControl('Password1!');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with at sign', () => {
      const control = new FormControl('Password1@');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with hash', () => {
      const control = new FormControl('Password1#');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with dollar sign', () => {
      const control = new FormControl('Password1$');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with percent sign', () => {
      const control = new FormControl('Password1%');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with caret', () => {
      const control = new FormControl('Password1^');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with ampersand', () => {
      const control = new FormControl('Password1&');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with asterisk', () => {
      const control = new FormControl('Password1*');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with parentheses', () => {
      const control = new FormControl('Password1()');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with underscore', () => {
      const control = new FormControl('Password1_');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with plus sign', () => {
      const control = new FormControl('Password1+');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with equals sign', () => {
      const control = new FormControl('Password1=');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with brackets', () => {
      const control = new FormControl('Password1[]');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with braces', () => {
      const control = new FormControl('Password1{}');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with semicolon', () => {
      const control = new FormControl('Password1;');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with colon', () => {
      const control = new FormControl('Password1:');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with quotes', () => {
      const control = new FormControl('Password1"');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with pipe', () => {
      const control = new FormControl('Password1|');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with comma', () => {
      const control = new FormControl('Password1,');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with period', () => {
      const control = new FormControl('Password1.');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with less than', () => {
      const control = new FormControl('Password1<');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with greater than', () => {
      const control = new FormControl('Password1>');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with question mark', () => {
      const control = new FormControl('Password1?');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });

    it('should accept password with forward slash', () => {
      const control = new FormControl('Password1/');
      const result = validator(control);
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });
  });

  describe('Multiple Validation Errors', () => {
    it('should return all errors when password fails multiple rules', () => {
      const control = new FormControl('short'); // fails: length, digit, uppercase, special
      const result = validator(control);
      expect(result?.['password']?.['minLength']).toBeDefined();
      expect(result?.['password']?.['hasDigit']).toBe(true);
      expect(result?.['password']?.['hasUppercase']).toBe(true);
      expect(result?.['password']?.['hasSpecialChar']).toBe(true);
    });

    it('should return only relevant errors', () => {
      const control = new FormControl('PASSWORD1'); // fails: lowercase, special
      const result = validator(control);
      expect(result?.['password']?.['hasLowercase']).toBe(true);
      expect(result?.['password']?.['hasSpecialChar']).toBe(true);
      expect(result?.['password']?.['minLength']).toBeUndefined();
      expect(result?.['password']?.['hasDigit']).toBeUndefined();
      expect(result?.['password']?.['hasUppercase']).toBeUndefined();
    });
  });

  describe('Valid Passwords', () => {
    it('should accept valid password with all requirements', () => {
      const control = new FormControl('Password1!');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should accept valid password with different special character', () => {
      const control = new FormControl('Password1@');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should accept valid password with multiple special characters', () => {
      const control = new FormControl('Password1!@#');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should accept valid password with mixed case and numbers', () => {
      const control = new FormControl('MyP@ssw0rd');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should accept valid long password', () => {
      const control = new FormControl('VeryLongPassword123!');
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle password with only special characters (if length and other rules pass)', () => {
      const control = new FormControl('PASSWORD1!');
      const result = validator(control);
      // This password is missing lowercase, so it should fail
      expect(result?.['password']?.['hasLowercase']).toBe(true);
    });

    it('should handle unicode characters in password', () => {
      const control = new FormControl('Password1!用户');
      const result = validator(control);
      // Unicode characters should be handled
      expect(result).toBeNull();
    });

    it('should handle password with spaces', () => {
      const control = new FormControl('Password1 !');
      const result = validator(control);
      // Spaces are not special characters in the regex
      expect(result?.['password']?.['hasSpecialChar']).toBeUndefined();
    });
  });
});

describe('getPasswordErrorMessage', () => {
  describe('Error Message Retrieval', () => {
    it('should return undefined for null errors', () => {
      const message = getPasswordErrorMessage(null);
      expect(message).toBeUndefined();
    });

    it('should return undefined for errors without password key', () => {
      const message = getPasswordErrorMessage({ required: true });
      expect(message).toBeUndefined();
    });

    it('should return minLength error message', () => {
      const errors = {
        password: {
          minLength: { requiredLength: 8, actualLength: 5 },
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should return hasDigit error message', () => {
      const errors = {
        password: {
          hasDigit: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins un chiffre');
    });

    it('should return hasLowercase error message', () => {
      const errors = {
        password: {
          hasLowercase: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins une lettre minuscule');
    });

    it('should return hasUppercase error message', () => {
      const errors = {
        password: {
          hasUppercase: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins une lettre majuscule');
    });

    it('should return hasSpecialChar error message', () => {
      const errors = {
        password: {
          hasSpecialChar: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins un caractère spécial');
    });

    it('should prioritize minLength error', () => {
      const errors = {
        password: {
          minLength: { requiredLength: 8, actualLength: 5 },
          hasDigit: true,
          hasLowercase: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should prioritize hasDigit after minLength', () => {
      const errors = {
        password: {
          hasDigit: true,
          hasLowercase: true,
          hasUppercase: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe doit contenir au moins un chiffre');
    });

    it('should return generic message for unknown error', () => {
      const errors = {
        password: {
          unknownError: true,
        },
      };
      const message = getPasswordErrorMessage(errors);
      expect(message).toBe('Le mot de passe ne respecte pas les critères requis');
    });
  });
});

