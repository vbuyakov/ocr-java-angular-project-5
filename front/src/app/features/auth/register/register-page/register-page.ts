import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { AuthApiService } from '@features/auth/auth-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/services/toast.service';
import { passwordValidator, getPasswordErrorMessage } from '@shared/validators/password.validator';

@Component({
  selector: 'app-register-page',
  imports: [FormInputComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  registerForm: FormGroup;
  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  get usernameControl() {
    return this.registerForm.get('username');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);

    const formValue = this.registerForm.value;

    this.authApiService.register({
      username: formValue.username.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastService.show('Inscription réussie !', 'success', 3000);
        this.router.navigate(['/auth/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.handleError(error);
      }
    });
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 409 && error.error?.errors) {
      // Conflict errors (duplicates) - returns { "errors": ["message1", "message2"] }
      const errors = error.error.errors as string[];
      this.generalErrors.set(errors);
      this.fieldErrors.set({});
    } else if (error.status === 400 && error.error) {
      // Validation errors - returns { "fieldName": "error message", ... }
      const fieldErrors: Record<string, string> = {};
      Object.keys(error.error).forEach(field => {
        if (field !== 'errors' && field !== 'message') {
          fieldErrors[field] = error.error[field];
        }
      });
      this.fieldErrors.set(fieldErrors);
      
      // Also check for general errors in the response
      if (error.error.message) {
        this.generalErrors.set([error.error.message]);
      }
    } else {
      // Other errors
      this.generalErrors.set([error.error?.message || 'Une erreur est survenue']);
    }
  }

  getFieldError(fieldName: string): string | undefined {
    return this.fieldErrors()[fieldName];
  }

  getGeneralErrors(): string[] {
    return this.generalErrors();
  }

  getPasswordErrorMessage = getPasswordErrorMessage;
}

