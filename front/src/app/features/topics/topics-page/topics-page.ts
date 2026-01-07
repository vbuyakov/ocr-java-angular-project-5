import { Component } from '@angular/core';
import { TopicsList } from '@shared/components/topics-list/topics-list';

@Component({
  selector: 'app-topics-page',
  imports: [TopicsList],
  templateUrl: './topics-page.html',
  styleUrl: './topics-page.css',
})
export class TopicsPage {}
