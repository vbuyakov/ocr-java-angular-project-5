import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleResponseDto } from '@features/articles/dtos/aticle-response.dto';
import { ArticlesApiService } from '@features/articles/articles-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticleComments } from '@features/articles/components/article-comments/article-comments';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-article-view-page',
  imports: [RouterLink, ArticleComments],
  templateUrl: './article-view-page.html',
  styleUrl: './article-view-page.css',
})
export class ArticleViewPage {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesApiService = inject(ArticlesApiService);

  articleId = toSignal<number | null>(
    this.activatedRoute.paramMap.pipe(
      map((params) => {
        const id = params.get('id');
        return id ? parseInt(id) : null;
      }),
    ),
    { initialValue: null },
  );

  article = signal<ArticleResponseDto | null>(null);
  constructor() {
    effect(() => {
      this.loadArticle();
    });
  }

  loadArticle() {
    this.articlesApiService.get(this.articleId() as number).subscribe({
      next: (articleReponse) => this.article.set(articleReponse),
      error: (ererrorResponse: HttpErrorResponse) => {
        if (ererrorResponse.status == 404) {
          //TODO: Implement on backend
          this.router.navigate(['/error/not-found']);
        }
      },
    });
  }
}
