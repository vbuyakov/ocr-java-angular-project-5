import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  get toasts() {
    return this.toastService.getToasts();
  }

  remove(id: string): void {
    this.toastService.remove(id);
  }
}

