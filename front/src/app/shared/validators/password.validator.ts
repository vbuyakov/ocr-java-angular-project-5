import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value as string;
    const errors: ValidationErrors = {};

    // Check minimum length
    if (value.length < 8) {
      errors['minLength'] = { requiredLength: 8, actualLength: value.length };
    }

    // Check for at least one digit
    if (!/\d/.test(value)) {
      errors['hasDigit'] = true;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      errors['hasLowercase'] = true;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['hasUppercase'] = true;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\]\[{};':"\\|,.<>/?]/.test(value)) {
      errors['hasSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? { password: errors } : null;
  };
}

export function getPasswordErrorMessage(errors: ValidationErrors | null): string | undefined {
  if (!errors || !errors['password']) {
    return undefined;
  }

  const passwordErrors = errors['password'] as ValidationErrors;

  if (passwordErrors['minLength']) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  if (passwordErrors['hasDigit']) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  if (passwordErrors['hasLowercase']) {
    return 'Le mot de passe doit contenir au moins une lettre minuscule';
  }
  if (passwordErrors['hasUppercase']) {
    return 'Le mot de passe doit contenir au moins une lettre majuscule';
  }
  if (passwordErrors['hasSpecialChar']) {
    return 'Le mot de passe doit contenir au moins un caractère spécial';
  }

  return 'Le mot de passe ne respecte pas les critères requis';
}
