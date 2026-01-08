import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TopicsApiService } from '@app/shared/services/topics-api.service';
import { ToastService } from '@shared/services/toast.service';
import { TopicResponseDto } from '@app/shared/dtos/topic-response.dto';
import { CreateArticleRequestDto } from '@features/articles/dtos/create-article-request.dto';
import { NgClass } from '@angular/common';
import {
  ServerError,
  handleServerError,
  getFieldError,
} from '@shared/validators/form-errors-handler';
import { ArticlesApiService } from '@features/articles/articles-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-article-create-page',
  imports: [RouterLink, FormInputComponent, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './article-create-page.html',
  styleUrl: './article-create-page.css',
})
export class ArticleCreatePage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly topicsApiService = inject(TopicsApiService);
  private readonly toastService = inject(ToastService);
  private readonly articleApiService = inject(ArticlesApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  articleForm: FormGroup;

  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);
  topicsList = signal<TopicResponseDto[]>([]);

  constructor() {
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required, Validators.maxLength(10000)]],
      topicId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.topicsApiService
      .getTopicsForSelector()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((topics) => this.topicsList.set(topics));
  }

  getFieldError(field: string): string | undefined {
    if (this.fieldErrors()[field]) {
      return this.fieldErrors()[field];
    }
    return getFieldError(this.articleForm, field);
  }

  onSubmit() {
    if (this.articleForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);
    const formValue: CreateArticleRequestDto = this.articleForm.value;

    this.articleApiService
      .create(formValue)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastService.show('L’article a bien été créé.', 'success');
          this.router.navigate(['/articles']);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const serverError: ServerError = handleServerError(errorResponse);
          this.generalErrors.set(serverError.generalErrors || []);
          this.fieldErrors.set(serverError.fieldErrors || {});
        },
      });
  }

  protected readonly top = top;
}
