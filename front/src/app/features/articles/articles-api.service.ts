import {inject, Injectable} from '@angular/core';
import { ApiService } from '@core/api/api.service';
import {Observable} from 'rxjs';
import { ArticleResponseDto } from './dtos/aticle-response.dto';


@Injectable({
    providedIn: 'root'
})

export class ArticlesApiService {
  private readonly apiService = inject(ApiService);

  getAll(orderBy: string, orderTo: string): Observable<ArticleResponseDto[]> {
    return this.apiService.get<ArticleResponseDto[]>(`/articles?sort=${orderBy},${orderTo}`);
  }
}
