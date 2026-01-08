import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TopicsPage } from './topics-page';

describe('TopicsPage', () => {
  let component: TopicsPage;
  let fixture: ComponentFixture<TopicsPage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Mock HTTP requests
    fixture.detectChanges();
    const req = httpMock.expectOne('/api/topics');
    req.flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
