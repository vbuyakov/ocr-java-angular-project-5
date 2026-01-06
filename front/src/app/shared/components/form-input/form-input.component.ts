import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [NgClass],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'textarea'>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  rows = input(1);
  disabled = input<boolean>(false);
  errorMessage = input<string | undefined>(undefined);
  // Support for form control disabled state
  formControlDisabled = input<boolean>(false);

  // Generate unique ID for label-input association
  inputId = `form-input-${Math.random().toString(36).substring(2, 9)}`;

  value = '';
  private _disabled = false;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  get isDisabled(): boolean {
    return this.disabled() || this._disabled || this.formControlDisabled();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
