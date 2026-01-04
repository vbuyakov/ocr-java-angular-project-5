import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-signal-form-input',
  imports: [
    NgClass
  ],
  templateUrl: './signal-form-input.html',
  styleUrl: './signal-form-input.css',
})
export class SignalFormInput implements FormValueControl<string> {
  label = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  errorMessage = input<string | undefined>(undefined);
  // Support for form control disabled state
  formControlDisabled = input<boolean>(false);

  // Generate unique ID for label-input association
  inputId = `form-input-${Math.random().toString(36).substring(2, 9)}`;

  value= model('')


  private _disabled: boolean = false;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage();
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
    this.value.set(target.value);
    this.onChange(this.value());
  }

  onBlur(): void {
    this.onTouched();
  }
}
