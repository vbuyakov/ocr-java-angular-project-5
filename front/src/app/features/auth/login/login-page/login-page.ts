import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../auth-api.service';
import { AuthService } from '@core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/services/toast.service';
import {
  ServerError,
  handleServerError,
  getFieldError,
} from '@shared/validators/form-errors-handler';
import { finalize } from 'rxjs';

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
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);

    const formValue = this.loginForm.value;

    this.authApiService
      .login({
        login: formValue.login.trim(),
        password: formValue.password,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.authService.login(response.token);
          this.toastService.show('Connexion réussie !', 'success', 3000);
          this.router.navigate(['/articles']);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const serverError: ServerError = handleServerError(errorResponse);
          this.generalErrors.set(serverError.generalErrors || []);
          this.fieldErrors.set(serverError.fieldErrors || {});
        },
      });
  }

  getFieldError(fieldName: string): string | undefined {
    if (this.fieldErrors()[fieldName]) {
      return this.fieldErrors()[fieldName];
    }
    return getFieldError(this.loginForm, fieldName);
  }

  getGeneralErrors(): string[] {
    return this.generalErrors();
  }
}
