import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ArticlesApiService } from '@features/articles/articles-api.service';
import { ArticleCommentDto } from '@features/articles/dtos/article-comment.dto';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ServerError,
  handleServerError,
  getFieldError,
} from '@shared/validators/form-errors-handler';
import { ToastService } from '@shared/services/toast.service';
import { CreateArticleCommentRequestDto } from '@features/articles/dtos/create-article-comment-request.dto';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-article-comments',
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './article-comments.html',
  styleUrl: './article-comments.css',
})
export class ArticleComments implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private articlesApiService = inject(ArticlesApiService);
  private readonly destroyRef = inject(DestroyRef);

  articleId = input.required<number>();

  comments = signal<ArticleCommentDto[]>([]);

  commentForm: FormGroup;
  isSubmitting = signal(false);
  fieldErrors = signal<Record<string, string>>({});
  generalErrors = signal<string[]>([]);

  constructor() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.articlesApiService
      .getComments(this.articleId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.comments.set(result);
      });
  }

  onSubmit() {
    if (this.commentForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.fieldErrors.set({});
    this.generalErrors.set([]);
    const formValue: CreateArticleCommentRequestDto = this.commentForm.value;

    this.articlesApiService
      .createComment(formValue, this.articleId())
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastService.show('Le commentaire a été ajouté.', 'success');
          this.commentForm.reset();
          this.loadComments();
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
    return getFieldError(this.commentForm, field);
  }
}
