import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ArticleComments } from './article-comments';

describe('ArticleComments', () => {
  let component: ArticleComments;
  let fixture: ComponentFixture<ArticleComments>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComments],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    
    fixture = TestBed.createComponent(ArticleComments);
    // Set required input
    fixture.componentRef.setInput('articleId', 1);
    component = fixture.componentInstance;
    
    // Mock HTTP request for loadComments
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/articles/1/comments');
    req.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
