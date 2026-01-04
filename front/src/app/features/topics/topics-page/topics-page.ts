import {Component, inject, OnInit, signal} from '@angular/core';
import {TopicsApiService} from '@features/topics/topics-api.service';
import {TopicResponseDto} from '@features/topics/dtos/topic-response.dto';

@Component({
  selector: 'app-topics-page',
  imports: [],
  templateUrl: './topics-page.html',
  styleUrl: './topics-page.css',
})
export class TopicsPage implements OnInit{

  private topicsApiService = inject(TopicsApiService);

  topicsList = signal<TopicResponseDto[]>([]);

  ngOnInit() {
    this.loadTopic();
  }

  loadTopic() {
    this.topicsApiService.getAll().subscribe((topics: TopicResponseDto[])=> {
      this.topicsList.set(topics);
    });
  }

  subscribeToTopic(topicId:number) {
    this.topicsApiService.subscribeToTopic(topicId).subscribe(
      () => this.loadTopic()
    );
  }

}
