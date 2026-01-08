import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);

  getToasts() {
    return this.toasts.asReadonly();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type };
    
    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}

