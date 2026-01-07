import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { vi, beforeEach, afterEach } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    service.clear();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty toasts', () => {
      const toasts = service.getToasts();
      expect(toasts().length).toBe(0);
    });
  });

  describe('show - Basic Functionality', () => {
    it('should add a toast with default type', () => {
      service.show('Test message');
      const toasts = service.getToasts();
      expect(toasts().length).toBe(1);
      expect(toasts()[0].message).toBe('Test message');
      expect(toasts()[0].type).toBe('info');
    });

    it('should add a toast with success type', () => {
      service.show('Success message', 'success');
      const toasts = service.getToasts();
      expect(toasts().length).toBe(1);
      expect(toasts()[0].type).toBe('success');
      expect(toasts()[0].message).toBe('Success message');
    });

    it('should add a toast with error type', () => {
      service.show('Error message', 'error');
      const toasts = service.getToasts();
      expect(toasts().length).toBe(1);
      expect(toasts()[0].type).toBe('error');
      expect(toasts()[0].message).toBe('Error message');
    });

    it('should add a toast with info type', () => {
      service.show('Info message', 'info');
      const toasts = service.getToasts();
      expect(toasts().length).toBe(1);
      expect(toasts()[0].type).toBe('info');
    });

    it('should generate unique ID for each toast', () => {
      service.show('Message 1');
      service.show('Message 2');
      const toasts = service.getToasts();
      expect(toasts()[0].id).not.toBe(toasts()[1].id);
    });

    it('should add multiple toasts', () => {
      service.show('Message 1');
      service.show('Message 2');
      service.show('Message 3');
      const toasts = service.getToasts();
      expect(toasts().length).toBe(3);
    });
  });

  describe('show - Duration Handling', () => {
    it('should remove toast after default duration (3000ms)', () => {
      service.show('Test message');
      expect(service.getToasts()().length).toBe(1);

      vi.advanceTimersByTime(3000);
      expect(service.getToasts()().length).toBe(0);
    });

    it('should remove toast after custom duration', () => {
      service.show('Test message', 'info', 5000);
      expect(service.getToasts()().length).toBe(1);

      vi.advanceTimersByTime(4999);
      expect(service.getToasts()().length).toBe(1);

      vi.advanceTimersByTime(1);
      expect(service.getToasts()().length).toBe(0);
    });

    it('should not remove toast when duration is 0', () => {
      service.show('Persistent message', 'info', 0);
      expect(service.getToasts()().length).toBe(1);

      vi.advanceTimersByTime(10000);
      expect(service.getToasts()().length).toBe(1);
    });

    it('should handle multiple toasts with different durations', () => {
      service.show('Short message', 'info', 1000);
      service.show('Long message', 'info', 5000);
      expect(service.getToasts()().length).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(service.getToasts()().length).toBe(1);
      expect(service.getToasts()()[0].message).toBe('Long message');

      vi.advanceTimersByTime(4000);
      expect(service.getToasts()().length).toBe(0);
    });
  });

  describe('remove', () => {
    it('should remove specific toast by ID', () => {
      service.show('Message 1');
      service.show('Message 2');
      const toasts = service.getToasts();
      const idToRemove = toasts()[0].id;

      service.remove(idToRemove);
      expect(service.getToasts()().length).toBe(1);
      expect(service.getToasts()()[0].message).toBe('Message 2');
    });

    it('should not remove other toasts when removing one', () => {
      service.show('Message 1');
      service.show('Message 2');
      service.show('Message 3');
      const toasts = service.getToasts();
      const idToRemove = toasts()[1].id;

      service.remove(idToRemove);
      const remainingToasts = service.getToasts()();
      expect(remainingToasts.length).toBe(2);
      expect(remainingToasts[0].message).toBe('Message 1');
      expect(remainingToasts[1].message).toBe('Message 3');
    });

    it('should handle removing non-existent ID gracefully', () => {
      service.show('Message 1');
      service.remove('non-existent-id');
      expect(service.getToasts()().length).toBe(1);
    });

    it('should handle removing from empty list', () => {
      service.remove('any-id');
      expect(service.getToasts()().length).toBe(0);
    });
  });

  describe('clear', () => {
    it('should remove all toasts', () => {
      service.show('Message 1');
      service.show('Message 2');
      service.show('Message 3');
      expect(service.getToasts()().length).toBe(3);

      service.clear();
      expect(service.getToasts()().length).toBe(0);
    });

    it('should handle clearing empty list', () => {
      service.clear();
      expect(service.getToasts()().length).toBe(0);
    });

    it('should cancel timers when clearing', () => {
      service.show('Message 1', 'info', 5000);
      service.show('Message 2', 'info', 5000);
      expect(service.getToasts()().length).toBe(2);

      service.clear();
      expect(service.getToasts()().length).toBe(0);

      vi.advanceTimersByTime(5000);
      expect(service.getToasts()().length).toBe(0);
    });
  });

  describe('getToasts', () => {
    it('should return readonly signal', () => {
      const toasts = service.getToasts();
      expect(toasts).toBeDefined();
      expect(typeof toasts).toBe('function');
    });

    it('should return updated toasts after adding', () => {
      const toasts = service.getToasts();
      expect(toasts().length).toBe(0);

      service.show('New message');
      expect(toasts().length).toBe(1);
    });

    it('should return updated toasts after removing', () => {
      service.show('Message 1');
      service.show('Message 2');
      const toasts = service.getToasts();
      const id = toasts()[0].id;

      service.remove(id);
      expect(toasts().length).toBe(1);
    });
  });

  describe('Toast Properties', () => {
    it('should create toast with all required properties', () => {
      service.show('Test message', 'success', 5000);
      const toasts = service.getToasts();
      const toast = toasts()[0];

      expect(toast).toHaveProperty('id');
      expect(toast).toHaveProperty('message');
      expect(toast).toHaveProperty('type');
      expect(toast.id).toBeTruthy();
      expect(toast.message).toBe('Test message');
      expect(toast.type).toBe('success');
    });

    it('should handle special characters in message', () => {
      const messages = [
        'Message with "quotes"',
        "Message with 'apostrophes'",
        'Message with\nnewline',
        'Message with unicode 用户',
        'Message with special chars !@#$%',
      ];

      messages.forEach((message) => {
        service.clear();
        service.show(message);
        const toasts = service.getToasts();
        expect(toasts()[0].message).toBe(message);
      });
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      service.show(longMessage);
      const toasts = service.getToasts();
      expect(toasts()[0].message).toBe(longMessage);
    });

    it('should handle empty message', () => {
      service.show('');
      const toasts = service.getToasts();
      expect(toasts()[0].message).toBe('');
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid show operations', () => {
      for (let i = 0; i < 10; i++) {
        service.show(`Message ${i}`);
      }
      expect(service.getToasts()().length).toBe(10);
    });

    it('should handle show and remove operations in sequence', () => {
      service.show('Message 1');
      const id1 = service.getToasts()()[0].id;
      service.show('Message 2');
      const id2 = service.getToasts()()[1].id;

      service.remove(id1);
      expect(service.getToasts()().length).toBe(1);

      service.show('Message 3');
      expect(service.getToasts()().length).toBe(2);

      service.remove(id2);
      expect(service.getToasts()().length).toBe(1);
      expect(service.getToasts()()[0].message).toBe('Message 3');
    });

    it('should handle multiple toasts expiring at different times', () => {
      service.show('Message 1', 'info', 1000);
      service.show('Message 2', 'info', 2000);
      service.show('Message 3', 'info', 3000);

      expect(service.getToasts()().length).toBe(3);

      vi.advanceTimersByTime(1000);
      expect(service.getToasts()().length).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(service.getToasts()().length).toBe(1);

      vi.advanceTimersByTime(1000);
      expect(service.getToasts()().length).toBe(0);
    });
  });
});

