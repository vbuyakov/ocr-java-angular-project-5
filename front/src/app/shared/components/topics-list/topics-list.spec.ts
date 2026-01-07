import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsList } from './topics-list';

describe('TopicsList', () => {
  let component: TopicsList;
  let fixture: ComponentFixture<TopicsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
