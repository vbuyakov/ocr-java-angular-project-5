import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsPage } from './topics-page';

describe('TopicsPage', () => {
  let component: TopicsPage;
  let fixture: ComponentFixture<TopicsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
