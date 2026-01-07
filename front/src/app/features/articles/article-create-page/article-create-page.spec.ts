import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { ArticleCreatePage } from './article-create-page';
import { ArticlesApiService } from '@features/articles/articles-api.service';
import { TopicsApiService } from '@shared/services/topics-api.service';
import { ToastService } from '@shared/services/toast.service';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { TopicResponseDto } from '@shared/dtos/topic-response.dto';
import { NgClass } from '@angular/common';

describe('ArticleCreatePage', () => {
  let component: ArticleCreatePage;
  let fixture: ComponentFixture<ArticleCreatePage>;
  let httpMock: HttpTestingController;
  let articlesApiService: ArticlesApiService;
  let router: Router;
  let toastService: ToastService;

  const mockTopics: TopicResponseDto[] = [
    { id: 1, name: 'Technology', description: 'Tech topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 2, name: 'Science', description: 'Science topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 3, name: 'Arts', description: 'Arts topics', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreatePage, ReactiveFormsModule, FormsModule, FormInputComponent, NgClass],
      providers: [
        provideRouter([
          { path: 'articles', component: {} as unknown },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreatePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    articlesApiService = TestBed.inject(ArticlesApiService);
    topicsApiService = TestBed.inject(TopicsApiService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);

    // Load topics
    fixture.detectChanges();
    const topicsReq = httpMock.expectOne('/api/topics/selector');
    topicsReq.flush(mockTopics);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.articleForm).toBeDefined();
      expect(component.articleForm.get('title')?.value).toBe('');
      expect(component.articleForm.get('content')?.value).toBe('');
      expect(component.articleForm.get('topicId')?.value).toBe(null);
    });

    it('should initialize form with required validators', () => {
      const titleControl = component.articleForm.get('title');
      const contentControl = component.articleForm.get('content');
      const topicIdControl = component.articleForm.get('topicId');

      expect(titleControl?.hasError('required')).toBe(true);
      expect(contentControl?.hasError('required')).toBe(true);
      expect(topicIdControl?.hasError('required')).toBe(true);
    });

    it('should initialize form with maxLength validators', () => {
      const titleControl = component.articleForm.get('title');
      const contentControl = component.articleForm.get('content');

      titleControl?.setValue('a'.repeat(256));
      contentControl?.setValue('a'.repeat(10001));

      expect(titleControl?.hasError('maxlength')).toBe(true);
      expect(contentControl?.hasError('maxlength')).toBe(true);
    });

    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting()).toBe(false);
    });

    it('should initialize fieldErrors as empty object', () => {
      expect(component.fieldErrors()).toEqual({});
    });

    it('should initialize generalErrors as empty array', () => {
      expect(component.generalErrors()).toEqual([]);
    });

    it('should load topics on init', () => {
      expect(component.topicsList()).toEqual(mockTopics);
    });
  });

  describe('Form Validation - Title Field', () => {
    it('should mark title as invalid when empty', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.setValue('');
      titleControl?.markAsTouched();

      expect(titleControl?.invalid).toBe(true);
      expect(titleControl?.hasError('required')).toBe(true);
    });

    it('should mark title as valid when filled', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.setValue('Test Article Title');
      titleControl?.markAsTouched();

      expect(titleControl?.valid).toBe(true);
    });

    it('should accept valid title values', () => {
      const titleControl = component.articleForm.get('title');
      const validTitles = [
        'My Article',
        'Article 123',
        'Test-Article_Title',
        'Article with Special Chars: !@#',
      ];

      validTitles.forEach((title) => {
        titleControl?.setValue(title);
        expect(titleControl?.valid).toBe(true);
      });
    });

    it('should reject title exceeding 255 characters', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.setValue('a'.repeat(256));

      expect(titleControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept title with exactly 255 characters', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.setValue('a'.repeat(255));

      expect(titleControl?.valid).toBe(true);
    });
  });

  describe('Form Validation - Content Field', () => {
    it('should mark content as invalid when empty', () => {
      const contentControl = component.articleForm.get('content');
      contentControl?.setValue('');
      contentControl?.markAsTouched();

      expect(contentControl?.invalid).toBe(true);
      expect(contentControl?.hasError('required')).toBe(true);
    });

    it('should mark content as valid when filled', () => {
      const contentControl = component.articleForm.get('content');
      contentControl?.setValue('This is article content');
      contentControl?.markAsTouched();

      expect(contentControl?.valid).toBe(true);
    });

    it('should accept valid content values', () => {
      const contentControl = component.articleForm.get('content');
      const validContents = [
        'Short content',
        'Long content with multiple paragraphs and detailed information about the topic.',
        'Content with special chars: !@#$%^&*()',
        'Content with numbers 123456',
      ];

      validContents.forEach((content) => {
        contentControl?.setValue(content);
        expect(contentControl?.valid).toBe(true);
      });
    });

    it('should reject content exceeding 10000 characters', () => {
      const contentControl = component.articleForm.get('content');
      contentControl?.setValue('a'.repeat(10001));

      expect(contentControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept content with exactly 10000 characters', () => {
      const contentControl = component.articleForm.get('content');
      contentControl?.setValue('a'.repeat(10000));

      expect(contentControl?.valid).toBe(true);
    });

    it('should handle multiline content', () => {
      const contentControl = component.articleForm.get('content');
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      contentControl?.setValue(multilineContent);

      expect(contentControl?.value).toBe(multilineContent);
      expect(contentControl?.valid).toBe(true);
    });
  });

  describe('Form Validation - TopicId Field', () => {
    it('should mark topicId as invalid when null', () => {
      const topicIdControl = component.articleForm.get('topicId');
      topicIdControl?.setValue(null);
      topicIdControl?.markAsTouched();

      expect(topicIdControl?.invalid).toBe(true);
      expect(topicIdControl?.hasError('required')).toBe(true);
    });

    it('should mark topicId as valid when selected', () => {
      const topicIdControl = component.articleForm.get('topicId');
      topicIdControl?.setValue(1);
      topicIdControl?.markAsTouched();

      expect(topicIdControl?.valid).toBe(true);
    });

    it('should accept valid topic IDs from topics list', () => {
      const topicIdControl = component.articleForm.get('topicId');

      mockTopics.forEach((topic) => {
        topicIdControl?.setValue(topic.id);
        expect(topicIdControl?.valid).toBe(true);
      });
    });
  });

  describe('Form State Management', () => {
    it('should mark form as invalid when all fields are empty', () => {
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when only title is filled', () => {
      component.articleForm.get('title')?.setValue('Test Title');
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when only content is filled', () => {
      component.articleForm.get('content')?.setValue('Test content');
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when only topicId is selected', () => {
      component.articleForm.get('topicId')?.setValue(1);
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when title and content are filled but topicId is missing', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
      });
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when title and topicId are set but content is missing', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        topicId: 1,
      });
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as invalid when content and topicId are set but title is missing', () => {
      component.articleForm.patchValue({
        content: 'Test content',
        topicId: 1,
      });
      expect(component.articleForm.invalid).toBe(true);
    });

    it('should mark form as valid when all fields are filled correctly', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });
      expect(component.articleForm.valid).toBe(true);
    });

    it('should update form values correctly', () => {
      component.articleForm.patchValue({
        title: 'New Title',
        content: 'New content',
        topicId: 2,
      });

      expect(component.articleForm.get('title')?.value).toBe('New Title');
      expect(component.articleForm.get('content')?.value).toBe('New content');
      expect(component.articleForm.get('topicId')?.value).toBe(2);
    });
  });

  describe('getFieldError', () => {
    it('should return undefined for valid untouched field', () => {
      const error = component.getFieldError('title');
      expect(error).toBeUndefined();
    });

    it('should return required error for empty touched field', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.markAsTouched();

      const error = component.getFieldError('title');
      expect(error).toBe('Ce champ est requis');
    });

    it('should return maxlength error for field exceeding max length', () => {
      const titleControl = component.articleForm.get('title');
      titleControl?.setValue('a'.repeat(256));
      titleControl?.markAsTouched();
      titleControl?.markAsDirty();

      const error = component.getFieldError('title');
      expect(error).toContain('Longueur du champ supérieure à 255 caractères');
    });

    it('should return server field error when present', () => {
      component.fieldErrors.set({ title: 'Server error message' });

      const error = component.getFieldError('title');
      expect(error).toBe('Server error message');
    });

    it('should prioritize server error over validation error', () => {
      component.fieldErrors.set({ title: 'Server error message' });
      const titleControl = component.articleForm.get('title');
      titleControl?.markAsTouched();

      const error = component.getFieldError('title');
      expect(error).toBe('Server error message');
    });
  });

  describe('onSubmit - Success Cases', () => {
    it('should not submit when form is invalid', () => {
      const createSpy = vi.spyOn(articlesApiService, 'create');

      component.onSubmit();

      expect(createSpy).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should not submit when already submitting', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });
      component.isSubmitting.set(true);

      const createSpy = vi.spyOn(articlesApiService, 'create');

      component.onSubmit();

      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should submit form with correct values', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/articles');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });
      req.flush({});
    });

    it('should set isSubmitting to true during submission', () => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(true);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/articles');
      req.flush({});
    });

    it('should clear field errors on submit', () => {
      component.fieldErrors.set({ title: 'Previous error' });
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });

      component.onSubmit();

      expect(component.fieldErrors()).toEqual({});
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/articles');
      req.flush({});
    });

    it('should clear general errors on submit', () => {
      component.generalErrors.set(['Previous error']);
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });

      component.onSubmit();

      expect(component.generalErrors()).toEqual([]);
      
      // Flush the HTTP request
      const req = httpMock.expectOne('/api/articles');
      req.flush({});
    });

    it('should handle successful article creation', () => {
      const toastSpy = vi.spyOn(toastService, 'show');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });

      component.onSubmit();

      const req = httpMock.expectOne('/api/articles');
      req.flush({ id: 1, title: 'Test Title' });

      expect(toastSpy).toHaveBeenCalledWith('L\u2019article a bien été créé.', 'success');
      expect(navigateSpy).toHaveBeenCalledWith(['/articles']);
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('onSubmit - Error Cases', () => {
    beforeEach(() => {
      component.articleForm.patchValue({
        title: 'Test Title',
        content: 'Test content',
        topicId: 1,
      });
    });

    it('should handle 400 validation errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/articles');
      req.flush(
        { title: 'Title too short', content: 'Content required' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(component.fieldErrors()).toEqual({
        title: 'Title too short',
        content: 'Content required',
      });
      expect(component.generalErrors()).toEqual([]);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle 409 conflict errors', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/articles');
      req.flush(
        { errors: ['Article already exists'] },
        { status: 409, statusText: 'Conflict' },
      );

      expect(component.generalErrors()).toEqual(['Article already exists']);
      expect(component.fieldErrors()).toEqual({});
      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle other error statuses', () => {
      component.onSubmit();

      const req = httpMock.expectOne('/api/articles');
      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(component.generalErrors()).toEqual(['Server error']);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset isSubmitting on error', () => {
      component.onSubmit();
      expect(component.isSubmitting()).toBe(true);

      const req = httpMock.expectOne('/api/articles');
      req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Topics Loading', () => {
    it('should load topics on component init', () => {
      expect(component.topicsList()).toEqual(mockTopics);
    });

    it('should update topicsList signal when topics are loaded', () => {
      const newTopics: TopicResponseDto[] = [
        { id: 4, name: 'New Topic', description: 'New', isUserSubscribed: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      // Simulate new topics loading
      component.topicsList.set(newTopics);
      expect(component.topicsList()).toEqual(newTopics);
    });
  });

  describe('Form Value Deep Testing', () => {
    it('should preserve exact form values', () => {
      const testCases = [
        { title: 'Article 1', content: 'Content 1', topicId: 1 },
        { title: 'Article 2', content: 'Content 2', topicId: 2 },
        { title: 'Article 3', content: 'Content 3', topicId: 3 },
      ];

      testCases.forEach((testCase) => {
        component.articleForm.patchValue(testCase);
        expect(component.articleForm.get('title')?.value).toBe(testCase.title);
        expect(component.articleForm.get('content')?.value).toBe(testCase.content);
        expect(component.articleForm.get('topicId')?.value).toBe(testCase.topicId);
      });
    });

    it('should handle special characters in title', () => {
      const specialTitles = [
        'Article with - dash',
        'Article with _ underscore',
        'Article with : colon',
        'Article with ! exclamation',
      ];

      specialTitles.forEach((title) => {
        component.articleForm.get('title')?.setValue(title);
        expect(component.articleForm.get('title')?.value).toBe(title);
      });
    });

    it('should handle multiline content', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3\n\nParagraph 2';
      component.articleForm.get('content')?.setValue(multilineContent);

      expect(component.articleForm.get('content')?.value).toBe(multilineContent);
    });

    it('should handle unicode characters in form values', () => {
      component.articleForm.patchValue({
        title: '文章标题',
        content: '文章内容',
        topicId: 1,
      });

      expect(component.articleForm.get('title')?.value).toBe('文章标题');
      expect(component.articleForm.get('content')?.value).toBe('文章内容');
    });

    it('should handle very long valid values', () => {
      const longTitle = 'a'.repeat(255);
      const longContent = 'b'.repeat(10000);

      component.articleForm.patchValue({
        title: longTitle,
        content: longContent,
        topicId: 1,
      });

      expect(component.articleForm.get('title')?.value).toBe(longTitle);
      expect(component.articleForm.get('content')?.value).toBe(longContent);
      expect(component.articleForm.valid).toBe(true);
    });

    it('should maintain form state after multiple updates', () => {
      component.articleForm.patchValue({
        title: 'Initial',
        content: 'Initial content',
        topicId: 1,
      });

      component.articleForm.patchValue({
        title: 'Updated',
        content: 'Updated content',
        topicId: 2,
      });

      expect(component.articleForm.get('title')?.value).toBe('Updated');
      expect(component.articleForm.get('content')?.value).toBe('Updated content');
      expect(component.articleForm.get('topicId')?.value).toBe(2);
    });

    it('should handle different topic IDs correctly', () => {
      mockTopics.forEach((topic) => {
        component.articleForm.get('topicId')?.setValue(topic.id);
        expect(component.articleForm.get('topicId')?.value).toBe(topic.id);
      });
    });
  });
});
