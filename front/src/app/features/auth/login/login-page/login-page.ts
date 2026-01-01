import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { Router, RouterLink } from '@angular/router';
import { passwordValidator, getPasswordErrorMessage } from '@shared/validators/password.validator';
import { AuthApiService } from '../../auth-api.service';
import { AuthService } from '@core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [FormInputComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  loginForm: FormGroup;
  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);

  constructor() {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  getPasswordErrorMessage = getPasswordErrorMessage;

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);

    const formValue = this.loginForm.value;

    this.authApiService.login({
      login: formValue.login.trim(),
      password: formValue.password,
    }).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.authService.login(response.token);
        this.toastService.show('Connexion réussie !', 'success', 3000);
        this.router.navigate(['/articles']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.handleError(error);
      }
    });
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 400 && error.error) {
      // Validation errors - returns { "fieldName": "error message", ... }
      const fieldErrors: Record<string, string> = {};
      Object.keys(error.error).forEach(field => {
        if (field !== 'errors' && field !== 'message') {
          fieldErrors[field] = error.error[field];
        }
      });
      this.fieldErrors.set(fieldErrors);
      
      if (error.error.message) {
        this.generalErrors.set([error.error.message]);
      }
    } else if (error.status === 401 || error.status === 403) {
      // Unauthorized/Forbidden - bad credentials
      this.generalErrors.set([error.error?.message || 'Identifiants incorrects']);
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
}
