import {Component, signal, effect, inject} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import { OrderBy } from '../dtos/article-request.dto';
import {FormsModule} from '@angular/forms';
import {ArticlesApiService} from '@features/articles/articles-api.service';
import {ArticleResponseDto} from '@features/articles/dtos/aticle-response.dto';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

type OrderByKey = keyof typeof OrderBy;
const DEFAULT_ORDER_BY: OrderByKey = 'createdAt';

@Component({
  selector: 'app-articles-page',
  imports: [RouterLink, FormsModule, AsyncPipe],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.css',
})
export class ArticlesPage {

  readonly OrderBy = OrderBy;
  readonly OrderByKeys = Object.keys(OrderBy) as OrderByKey[];
  orderByValue = signal<string>(DEFAULT_ORDER_BY);
  orderToValue = signal<string>('asc');

  isLoading = signal(false);
  articles$!: Observable<ArticleResponseDto[]>;

  private articlesApiService = inject(ArticlesApiService);
  private router = inject(Router);

  constructor() {
    effect(()=>{
      this.articles$ = this.articlesApiService.getAll(this.orderByValue(), this.orderToValue());
    });
  }

  orderToChanged() {
    this.orderToValue.update(value => value === 'asc' ? 'desc' : 'asc');
  }

  showArticle(articleId: number):void {
      this.router.navigate(['/articles', articleId]);
  }

}
