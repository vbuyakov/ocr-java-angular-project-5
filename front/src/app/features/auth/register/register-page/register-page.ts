import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { AuthApiService } from '@features/auth/auth-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/services/toast.service';
import { passwordValidator } from '@shared/validators/password.validator';
import {
  ServerError,
  handleServerError,
  getFieldError,
} from '@shared/validators/form-errors-handler';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly destroyRef = inject(DestroyRef);

  registerForm: FormGroup;
  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required,Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email,Validators.maxLength(255)]],
      password: ['', [Validators.required, passwordValidator(), Validators.maxLength(255)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);

    const formValue = this.registerForm.value;

    this.authApiService
      .register({
        username: formValue.username.trim(),
        email: formValue.email.trim(),
        password: formValue.password,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastService.show('Inscription réussie !', 'success', 3000);
          this.router.navigate(['/auth/login']);
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
    return getFieldError(this.registerForm, fieldName);
  }

  getGeneralErrors(): string[] {
    return this.generalErrors();
  }
}
