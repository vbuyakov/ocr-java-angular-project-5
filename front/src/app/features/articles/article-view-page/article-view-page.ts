import { Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleResponseDto } from '@features/articles/dtos/aticle-response.dto';
import { ArticlesApiService } from '@features/articles/articles-api.service';
import { ArticleComments } from '@features/articles/components/article-comments/article-comments';
import { toSignal } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly destroyRef = inject(DestroyRef);

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
    this.articlesApiService
      .get(this.articleId() as number)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((articleReponse) => this.article.set(articleReponse));
  }
}
