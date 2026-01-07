import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TopicsApiService } from '@app/shared/services/topics-api.service';
import { TopicResponseDto } from '@app/shared/dtos/topic-response.dto';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '@shared/validators/password.validator';
import { UserProfileRequestDto } from '@features/profile/dtos/user-profile-request.dto';
import { UserProfileApiService } from '@features/profile/user-profile-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileResponseDto } from '@features/profile/dtos/user-profile-response.dto';
import { ToastService } from '@shared/services/toast.service';
import {
  ServerError,
  handleServerError,
  getFieldError,
} from '@shared/validators/form-errors-handler';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly destroyRef = inject(DestroyRef);
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
    this.userProfileApiService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((profileResponse) => {
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
    this.topicsApiService
      .getTopicsForUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((topics) => this.topicsList.set(topics));
  }

  unsubscribeFromTopic(topicId: number) {
    this.topicsApiService
      .unsubscribeFromTopic(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
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
    this.userProfileApiService
      .updateProfile(formValue)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedProfile: UserProfileResponseDto) => {
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
        error: (errorResponse: HttpErrorResponse) => {
          const serverError: ServerError = handleServerError(errorResponse);
          this.generalErrors.set(serverError.generalErrors || []);
          this.fieldErrors.set(serverError.fieldErrors || {});
        },
      });
  }

  getFieldError(field: string): string | undefined {
    if (this.fieldErrors()[field]) {
      return this.fieldErrors()[field];
    }
    return getFieldError(this.profileForm, field);
  }
}
