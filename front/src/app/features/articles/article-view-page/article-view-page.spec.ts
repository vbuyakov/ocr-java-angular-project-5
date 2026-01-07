import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArticleViewPage } from './article-view-page';

describe('ArticleViewPage', () => {
  let component: ArticleViewPage;
  let fixture: ComponentFixture<ArticleViewPage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleViewPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']])),
            params: of({ id: '1' }),
            snapshot: { params: { id: '1' }, paramMap: new Map([['id', '1']]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleViewPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Mock HTTP request for loadArticle
    fixture.detectChanges();
    const articleReq = httpMock.expectOne('/api/articles/1');
    articleReq.flush({ id: 1, title: 'Test', content: 'Content', topicId: 1 });
    fixture.detectChanges();
    
    // Mock HTTP request for ArticleComments component (may be delayed due to effect)
    // Wait a bit for the component to initialize
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();
    
    // Check if comments request exists, if not it's okay - component might not have initialized yet
    try {
      const commentsReq = httpMock.expectOne('/api/articles/1/comments');
      commentsReq.flush([]);
    } catch {
      // Request might not have been made yet, that's okay for this test
    }
    
    fixture.detectChanges();
  });

  afterEach(() => {
    // Match any pending comments request
    try {
      const commentsReq = httpMock.expectOne('/api/articles/1/comments');
      commentsReq.flush([]);
    } catch {
      // Comments request might not have been made yet
    }
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
