import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopicsApiService } from '@app/shared/services/topics-api.service';
import { TopicResponseDto } from '@app/shared/dtos/topic-response.dto';

type TopicsListMode = 'all' | 'subscribed';

@Component({
  selector: 'app-topics-list',
  imports: [],
  templateUrl: './topics-list.html',
  styleUrl: './topics-list.css',
})
export class TopicsList {
  private readonly topicsApiService = inject(TopicsApiService);
  private readonly destroyRef = inject(DestroyRef);

  mode = input<TopicsListMode>('all');
  topicsList = signal<TopicResponseDto[]>([]);

  constructor() {
    effect(() => {
      this.loadTopics();
    });
  }

  loadTopics() {
    const request$ =
      this.mode() === 'subscribed'
        ? this.topicsApiService.getTopicsForUser()
        : this.topicsApiService.getAll();

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((topics) => this.topicsList.set(topics));
  }

  subscribeToTopic(topicId: number) {
    this.topicsApiService
      .subscribeToTopic(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadTopics());
  }

  unsubscribeFromTopic(topicId: number) {
    this.topicsApiService
      .unsubscribeFromTopic(topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.mode() === 'subscribed') {
          this.topicsList.update((topics) => topics.filter((topic) => topic.id !== topicId));
          return;
        }
        this.loadTopics();
      });
  }
}
