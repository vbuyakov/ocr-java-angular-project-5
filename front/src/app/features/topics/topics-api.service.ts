import {inject, Injectable} from '@angular/core';
import {ApiService} from '@core/api/api.service';
import {Observable} from 'rxjs';
import {TopicResponseDto} from '@features/topics/dtos/topic-response.dto';

@Injectable({
  providedIn: 'root',
})
export class TopicsApiService {
  private readonly apiService = inject(ApiService);

  getAll(): Observable<TopicResponseDto[]> {
    return this.apiService.get('/topics');
  }

  getTopicsForUser(): Observable<TopicResponseDto[]> {
    return this.apiService.get('/topics/subscribed');
  }

  subscribeToTopic(topicId: number): Observable<any> {
    return this.apiService.post(`/topics/${topicId}/subscribe`, {});
  }

  unsubscribeFromTopic(topicId: number): Observable<any> {
    return this.apiService.delete(`/topics/${topicId}/subscribe`);
  }

}
