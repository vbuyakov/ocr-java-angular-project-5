import { HttpErrorResponse } from '@angular/common/http';
import { getPasswordErrorMessage } from '@shared/validators/password.validator';
import { FormGroup } from '@angular/forms';

export interface ServerError {
  generalErrors?: string[];
  fieldErrors?: Record<string, string>;
}

export function handleServerError(error: HttpErrorResponse): ServerError {
  const errorResult: ServerError = {};

  if (error.status === 409 && error.error?.errors) {
    // Conflict errors (duplicates) - returns { "errors": ["message1", "message2"] }
    const errors = error.error.errors as string[];
    errorResult.generalErrors = errors;
  } else if (error.status === 400 && error.error) {
    // Validation errors - returns { "fieldName": "error message", ... }
    const fieldErrors: Record<string, string> = {};
    Object.keys(error.error).forEach((field) => {
      if (field !== 'errors' && field !== 'message') {
        fieldErrors[field] = error.error[field];
      }
    });
    errorResult.fieldErrors = fieldErrors;

    // Also check for general errors in the response
    if (error.error.message) {
      errorResult.generalErrors = [error.error.message];
    }
  } else {
    // Other errors
    errorResult.generalErrors = [error.error?.message || 'Une erreur est survenue'];
  }
  return errorResult;
}

export function getFieldError(form: FormGroup, field: string): string | undefined {
  const fildControl = form.get(field);
  if (fildControl?.invalid && (fildControl?.dirty || fildControl?.touched)) {
    //Max
    if (fildControl.hasError('maxlength')) {
      const maxLengthError = fildControl.getError('maxlength');
      return `Longueur du champ supérieure à ${maxLengthError.requiredLength} caractères (${maxLengthError.actualLength}).`;
    }
    //Required
    if (fildControl.hasError('required')) {
      return 'Ce champ est requis';
    }
    //Email
    return fildControl.hasError('email')
      ? 'Email invalide'
      : fildControl.hasError('password')
        ? getPasswordErrorMessage(fildControl)
        : undefined;
  }
  return undefined;
}
