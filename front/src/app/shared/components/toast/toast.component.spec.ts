import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '@shared/services/toast.service';
import { vi } from 'vitest';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty toasts', () => {
      expect(component.toasts().length).toBe(0);
    });
  });

  describe('Toast Display', () => {
    it('should display toasts from ToastService', () => {
      toastService.show('Test message', 'info');
      fixture.detectChanges();

      expect(component.toasts().length).toBe(1);
      expect(component.toasts()[0].message).toBe('Test message');
      expect(component.toasts()[0].type).toBe('info');
    });

    it('should display multiple toasts', () => {
      toastService.show('First message', 'success');
      toastService.show('Second message', 'error');
      toastService.show('Third message', 'info');
      fixture.detectChanges();

      expect(component.toasts().length).toBe(3);
    });

    it('should display success toast', () => {
      toastService.show('Success message', 'success');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toast = compiled.querySelector('.toast-success');
      expect(toast).toBeTruthy();
      expect(toast?.textContent).toContain('Success message');
    });

    it('should display error toast', () => {
      toastService.show('Error message', 'error');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toast = compiled.querySelector('.toast-error');
      expect(toast).toBeTruthy();
      expect(toast?.textContent).toContain('Error message');
    });

    it('should display info toast', () => {
      toastService.show('Info message', 'info');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toast = compiled.querySelector('.toast-info');
      expect(toast).toBeTruthy();
      expect(toast?.textContent).toContain('Info message');
    });

    it('should display toast message in template', () => {
      toastService.show('Test message', 'success');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const message = compiled.querySelector('.toast-message');
      expect(message?.textContent).toBe('Test message');
    });

    it('should have role="alert" on toast element', () => {
      toastService.show('Alert message', 'error');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toast = compiled.querySelector('[role="alert"]');
      expect(toast).toBeTruthy();
    });
  });

  describe('Remove Toast', () => {
    it('should remove toast when remove is called', () => {
      toastService.show('First message', 'info');
      toastService.show('Second message', 'info');
      fixture.detectChanges();

      expect(component.toasts().length).toBe(2);

      const firstToastId = component.toasts()[0].id;
      component.remove(firstToastId);
      fixture.detectChanges();

      expect(component.toasts().length).toBe(1);
      expect(component.toasts()[0].message).toBe('Second message');
    });

    it('should call remove when close button is clicked', () => {
      toastService.show('Test message', 'info');
      fixture.detectChanges();

      const removeSpy = vi.spyOn(component, 'remove');
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.toast-close') as HTMLButtonElement;

      closeButton?.click();
      fixture.detectChanges();

      expect(removeSpy).toHaveBeenCalled();
    });

    it('should remove correct toast when close button is clicked', () => {
      toastService.show('First message', 'info');
      toastService.show('Second message', 'error');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButtons = compiled.querySelectorAll('.toast-close');

      (closeButtons[0] as HTMLButtonElement)?.click();
      fixture.detectChanges();

      expect(component.toasts().length).toBe(1);
      expect(component.toasts()[0].message).toBe('Second message');
    });

    it('should have aria-label on close button', () => {
      toastService.show('Test message', 'info');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.toast-close') as HTMLButtonElement;
      expect(closeButton?.getAttribute('aria-label')).toBe('Close');
    });

    it('should display close button (×)', () => {
      toastService.show('Test message', 'info');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.toast-close');
      expect(closeButton?.textContent?.trim()).toBe('×');
    });
  });

  describe('Toast Container', () => {
    it('should have toast-container class', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.toast-container');
      expect(container).toBeTruthy();
    });

    it('should render no toasts when empty', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toasts = compiled.querySelectorAll('.toast');
      expect(toasts.length).toBe(0);
    });

    it('should track toasts by id', () => {
      toastService.show('First', 'info');
      toastService.show('Second', 'info');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const toasts = compiled.querySelectorAll('.toast');
      expect(toasts.length).toBe(2);

      // Each toast should have unique id
      const ids = component.toasts().map(t => t.id);
      expect(new Set(ids).size).toBe(2);
    });
  });

  describe('Multiple Toast Types', () => {
    it('should display toasts with different types simultaneously', () => {
      toastService.show('Success', 'success');
      toastService.show('Error', 'error');
      toastService.show('Info', 'info');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.toast-success')).toBeTruthy();
      expect(compiled.querySelector('.toast-error')).toBeTruthy();
      expect(compiled.querySelector('.toast-info')).toBeTruthy();
    });
  });
});

