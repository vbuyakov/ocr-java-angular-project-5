import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {TopicsApiService} from '@app/shared/services/topics-api.service';
import {TopicResponseDto} from '@app/shared/dtos/topic-response.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-topics-page',
  imports: [],
  templateUrl: './topics-page.html',
  styleUrl: './topics-page.css',
})
export class TopicsPage implements OnInit{

  private topicsApiService = inject(TopicsApiService);
  private destroyRef = inject(DestroyRef);

  topicsList = signal<TopicResponseDto[]>([]);

  ngOnInit() {
    this.loadTopic();
  }

  loadTopic() {
    this.topicsApiService.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((topics: TopicResponseDto[])=> {
      this.topicsList.set(topics);
    });
  }

  subscribeToTopic(topicId:number) {
    this.topicsApiService.subscribeToTopic(topicId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      () => this.loadTopic()
    );
  }

}
