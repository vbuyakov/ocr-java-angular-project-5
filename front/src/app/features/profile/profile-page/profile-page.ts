import { Component, inject, OnInit, signal } from '@angular/core';
import { TopicsApiService } from '@features/topics/topics-api.service';
import { TopicResponseDto } from '@features/topics/dtos/topic-response.dto';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPasswordErrorMessage, passwordValidator } from '@shared/validators/password.validator';
import { UserProfileRequestDto } from '@features/profile/dtos/user-profile-request.dto';
import { UserProfileApiService } from '@features/profile/user-profile-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileResponseDto } from '@features/profile/dtos/user-profile-response.dto';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-profile-page',
  imports: [FormInputComponent, ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private readonly topicsApiService = inject(TopicsApiService);
  private readonly userProfileApiService = inject(UserProfileApiService);
  private readonly toastService = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  topicsList = signal<TopicResponseDto[]>([]);

  profileForm: FormGroup;

  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);

  constructor() {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [passwordValidator()]],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadTopics();
  }

  loadUserProfile() {
    this.userProfileApiService.getProfile().subscribe((profileResponse) => {
      this.profileForm.setValue(
        {
          username: profileResponse.username,
          email: profileResponse.email,
          password: '',
        },
        { emitEvent: false },
      );
    });
  }

  loadTopics() {
    this.topicsApiService.getTopicsForUser().subscribe((topics) => this.topicsList.set(topics));
  }

  unsubscribeFromTopic(topicId: number) {
    this.topicsApiService.unsubscribeFromTopic(topicId).subscribe(() => {
      this.topicsList.update((topics) => topics.filter((topic) => topic.id !== topicId));
    });
  }

  onSubmit() {
    if (this.profileForm.invalid || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);

    const formValue: UserProfileRequestDto = this.profileForm.value;
    this.userProfileApiService.updateProfile(formValue).subscribe({
      next: (updatedProfile: UserProfileResponseDto) => {
        this.isSubmitting.set(false);
        this.toastService.show('Votre profil a bien été mis à jour !', 'success', 3000);
        this.profileForm.setValue(
          {
            username: updatedProfile.username,
            email: updatedProfile.email,
            password: '',
          },
          { emitEvent: false },
        );
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.handleError(error);
      },
    });
  }

  //Todo: Move to Common Reused in all forms
  private handleError(error: HttpErrorResponse): void {
    if (error.status === 409 && error.error?.errors) {
      // Conflict errors (duplicates) - returns { "errors": ["message1", "message2"] }
      const errors = error.error.errors as string[];
      this.generalErrors.set(errors);
      this.fieldErrors.set({});
    } else if (error.status === 400 && error.error) {
      // Validation errors - returns { "fieldName": "error message", ... }
      const fieldErrors: Record<string, string> = {};
      Object.keys(error.error).forEach((field) => {
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

  getFieldError(field: string): string | undefined {
    const fildControl = this.profileForm.get(field);
    if (this.fieldErrors()[field]) {
      return this.fieldErrors()[field];
    } else if (fildControl?.invalid && (fildControl?.dirty || fildControl?.touched)) {
      if (fildControl.hasError('required')) {
        return 'Ce champ est requis';
      }
      return fildControl.hasError('email')
        ? 'Email invalide'
        : fildControl.hasError('password')
          ? getPasswordErrorMessage(fildControl)
          : undefined;
    }
    return undefined;
  }
}
