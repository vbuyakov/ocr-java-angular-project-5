import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleViewPage } from './article-view-page';

describe('ArticleViewPage', () => {
  let component: ArticleViewPage;
  let fixture: ComponentFixture<ArticleViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
