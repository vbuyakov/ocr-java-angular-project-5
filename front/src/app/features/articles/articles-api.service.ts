import {inject, Injectable} from '@angular/core';
import { ApiService } from '@core/api/api.service';
import {Observable} from 'rxjs';
import { ArticleResponseDto } from './dtos/aticle-response.dto';
import {CreateArticleRequestDto} from '@features/articles/dtos/create-article-request.dto';
import {ArticleCommentDto} from '@features/articles/dtos/article-comment.dto';
import {CreateArticleCommentRequestDto} from '@features/articles/dtos/create-article-comment-request.dto';


@Injectable({
    providedIn: 'root'
})

export class ArticlesApiService {
  private readonly apiService = inject(ApiService);

  getAll(orderBy: string, orderTo: string): Observable<ArticleResponseDto[]> {
    return this.apiService.get<ArticleResponseDto[]>(`/articles?sort=${orderBy},${orderTo}`);
  }

  create(payload: CreateArticleRequestDto) {
    return this.apiService.post('/articles', payload);
  }

  getComments(articleId: number): Observable<ArticleCommentDto[]> {
    return this.apiService.get<ArticleCommentDto[]>(`/articles/${articleId}/comments`);
  }

  createComment(payload: CreateArticleCommentRequestDto, articleId: number) {
    return this.apiService.post(`/articles/${articleId}/comments`, payload);
  }
}
