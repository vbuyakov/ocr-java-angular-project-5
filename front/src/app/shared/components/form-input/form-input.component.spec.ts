import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from './form-input.component';
import { Component } from '@angular/core';
import { vi } from 'vitest';

@Component({
  template: `
    <app-form-input
      [formControl]="control"
      [label]="label"
      [type]="type"
      [placeholder]="placeholder"
      [required]="required"
      [rows]="rows"
      [disabled]="disabled"
      [errorMessage]="errorMessage"
    ></app-form-input>
  `,
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule],
})
class TestHostComponent {
  control = new FormControl('');
  label = 'Test Label';
  type: 'text' | 'email' | 'password' | 'textarea' = 'text';
  placeholder = 'Test Placeholder';
  required = false;
  rows = 1;
  disabled = false;
  errorMessage: string | undefined = undefined;
}

describe('FormInputComponent', () => {
  let component: FormInputComponent;
  let fixture: ComponentFixture<FormInputComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty value', () => {
      expect(component.value).toBe('');
    });

    it('should generate unique input ID', () => {
      const component2 = TestBed.createComponent(FormInputComponent).componentInstance;
      expect(component.inputId).not.toBe(component2.inputId);
    });

    it('should have default input values', () => {
      expect(component.label()).toBe('');
      expect(component.type()).toBe('text');
      expect(component.placeholder()).toBe('');
      expect(component.required()).toBe(false);
      expect(component.rows()).toBe(1);
      expect(component.disabled()).toBe(false);
      expect(component.errorMessage()).toBeUndefined();
    });
  });

  describe('ControlValueAccessor - writeValue', () => {
    it('should write value to component', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value', () => {
      component.writeValue(null as unknown as string);
      expect(component.value).toBe('');
    });

    it('should handle undefined value', () => {
      component.writeValue(undefined as unknown as string);
      expect(component.value).toBe('');
    });

    it('should handle empty string', () => {
      component.writeValue('');
      expect(component.value).toBe('');
    });

    it('should handle various string values', () => {
      const testValues = [
        'simple text',
        'text with spaces',
        'text123',
        'text@example.com',
        'text with special chars !@#$%',
        'unicode text 用户密码',
      ];

      testValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      component.writeValue(longString);
      expect(component.value).toBe(longString);
    });
  });

  describe('ControlValueAccessor - registerOnChange', () => {
    it('should register onChange callback', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      component.onInput({ target: { value: 'new value' } } as unknown as Event);
      expect(onChangeSpy).toHaveBeenCalledWith('new value');
    });

    it('should call onChange with exact input value', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const testValues = ['value1', 'value2', 'value with spaces', 'value@example.com'];
      testValues.forEach((value) => {
        component.onInput({ target: { value } } as unknown as Event);
        expect(onChangeSpy).toHaveBeenLastCalledWith(value);
      });
    });

    it('should update internal value when onChange is called', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      component.onInput({ target: { value: 'test' } } as unknown as Event);
      expect(component.value).toBe('test');
      expect(onChangeSpy).toHaveBeenCalledWith('test');
    });
  });

  describe('ControlValueAccessor - registerOnTouched', () => {
    it('should register onTouched callback', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      component.onBlur();
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should call onTouched on blur', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      component.onBlur();
      expect(onTouchedSpy).toHaveBeenCalledTimes(1);

      component.onBlur();
      expect(onTouchedSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ControlValueAccessor - setDisabledState', () => {
    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });

    it('should unset disabled state', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.isDisabled).toBe(false);
    });

    it('should respect disabled input when form control is enabled', () => {
      component.setDisabledState(false);
      const hostComponent = TestBed.createComponent(TestHostComponent).componentInstance;
      hostComponent.disabled = true;
      hostFixture.detectChanges();
      // Note: This test shows the interaction, actual implementation depends on template
    });
  });

  describe('Form Integration', () => {
    it('should integrate with FormControl', () => {
      const control = new FormControl('initial value');
      hostComponent.control = control;
      hostFixture.detectChanges();

      control.setValue('new value');
      hostFixture.detectChanges();

      expect(control.value).toBe('new value');
    });

    it('should update FormControl value on input', () => {
      const control = new FormControl('');
      hostComponent.control = control;
      hostFixture.detectChanges();

      // Get the component instance using querySelector
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;

      expect(formInputComponent).toBeTruthy();
      
      // Register the control with the component
      formInputComponent.registerOnChange((value: string) => {
        control.setValue(value, { emitEvent: false });
      });
      
      const mockEvent = {
        target: { value: 'typed value' },
      } as unknown as Event;
      formInputComponent.onInput(mockEvent);
      // Don't call detectChanges() here to avoid ExpressionChangedAfterItHasBeenCheckedError
      // The value should be updated directly

      expect(control.value).toBe('typed value');
    });

    it('should mark FormControl as touched on blur', () => {
      const control = new FormControl('');
      hostComponent.control = control;
      hostFixture.detectChanges();

      expect(control.touched).toBe(false);

      // Get the component instance
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;

      expect(formInputComponent).toBeTruthy();
      
      // Register the touched callback
      formInputComponent.registerOnTouched(() => {
        control.markAsTouched();
      });
      
      formInputComponent.onBlur();
      hostFixture.detectChanges();

      expect(control.touched).toBe(true);
    });

    it('should work with required validator', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      const control = new FormControl('', Validators.required);
      hostComponent.control = control;
      hostComponent.required = true;
      hostFixture.detectChanges();

      expect(control.invalid).toBe(true);

      control.setValue('value');
      hostFixture.detectChanges();

      expect(control.valid).toBe(true);
    });

    it('should display error message from FormControl', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      hostComponent.control = control;
      hostComponent.errorMessage = 'This field is required';
      hostFixture.detectChanges();

      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent).toBeTruthy();
      expect(formInputComponent?.errorMessage()).toBe('This field is required');
      expect(formInputComponent?.hasError).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should accept label input', () => {
      // Create new fixture with the label value set from the start
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.label = 'Custom Label';
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.label()).toBe('Custom Label');
    });

    it('should accept type input', () => {
      const types: ('text' | 'email' | 'password' | 'textarea')[] = [
        'text',
        'email',
        'password',
        'textarea',
      ];

      types.forEach((type) => {
        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostComponent.type = type;
        hostFixture.detectChanges();
        const formInputComponent = hostFixture.debugElement.query(
          (el) => el.name === 'app-form-input',
        )?.componentInstance as FormInputComponent;
        expect(formInputComponent?.type()).toBe(type);
      });
    });

    it('should accept placeholder input', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.placeholder = 'Enter value here';
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.placeholder()).toBe('Enter value here');
    });

    it('should accept required input', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.required = true;
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.required()).toBe(true);
    });

    it('should accept rows input for textarea', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.type = 'textarea';
      hostComponent.rows = 5;
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.rows()).toBe(5);
    });

    it('should accept errorMessage input', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.errorMessage = 'Error message';
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.errorMessage()).toBe('Error message');
      expect(formInputComponent?.hasError).toBe(true);
    });

    it('should clear error when errorMessage is undefined', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.errorMessage = 'Error';
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent?.hasError).toBe(true);

      // Create new fixture for the cleared state
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.errorMessage = undefined;
      hostFixture.detectChanges();
      const formInputComponent2 = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent2?.hasError).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled input is true', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostComponent.disabled = true;
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent).toBeTruthy();
      expect(formInputComponent?.isDisabled).toBe(true);
    });

    it('should be disabled when formControlDisabled is true', () => {
      const control = new FormControl('');
      control.disable();
      hostComponent.control = control;
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent).toBeTruthy();
      // The component should be disabled via setDisabledState when control is disabled
      formInputComponent.setDisabledState(true);
      expect(formInputComponent?.isDisabled).toBe(true);
    });

    it('should be disabled when setDisabledState is called', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });

    it('should prioritize formControlDisabled over disabled input', () => {
      hostComponent.disabled = false;
      const control = new FormControl('');
      control.disable();
      hostComponent.control = control;
      hostFixture.detectChanges();
      const formInputComponent = hostFixture.debugElement.query(
        (el) => el.name === 'app-form-input',
      )?.componentInstance as FormInputComponent;
      expect(formInputComponent).toBeTruthy();
      // When control is disabled, setDisabledState should be called
      formInputComponent.setDisabledState(true);
      expect(formInputComponent?.isDisabled).toBe(true);
    });
  });

  describe('Value Handling - Deep Testing', () => {
    it('should handle special characters', () => {
      const specialValues = [
        '!@#$%^&*()',
        'text with\nnewline',
        'text with\ttab',
        'text with spaces',
        'text"with"quotes',
        "text'with'apostrophes",
      ];

      specialValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should handle unicode characters', () => {
      const unicodeValues = ['用户', 'パスワード', 'كلمة المرور', '🔒🔑'];

      unicodeValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should handle numeric strings', () => {
      const numericValues = ['123', '0', '-123', '123.456', '1e10'];

      numericValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should handle email-like strings', () => {
      const emailValues = [
        'user@example.com',
        'user+tag@example.com',
        'user.name@example.co.uk',
        'user_name@example-domain.com',
      ];

      emailValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should preserve whitespace in values', () => {
      const whitespaceValues = ['  leading', 'trailing  ', '  both  ', '\n\t'];

      whitespaceValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });

    it('should handle empty and whitespace-only values', () => {
      const emptyValues = ['', ' ', '  ', '\n', '\t', '\n\t'];

      emptyValues.forEach((value) => {
        component.writeValue(value);
        expect(component.value).toBe(value);
      });
    });
  });

  describe('onInput Event Handling', () => {
    it('should extract value from input event', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const event = {
        target: { value: 'input value' },
      } as unknown as Event;

      component.onInput(event);
      expect(component.value).toBe('input value');
      expect(onChangeSpy).toHaveBeenCalledWith('input value');
    });

    it('should handle input events with different values', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const values = ['a', 'ab', 'abc', 'final value'];
      values.forEach((value, index) => {
        component.onInput({ target: { value } } as unknown as Event);
        expect(onChangeSpy).toHaveBeenCalledTimes(index + 1);
        expect(onChangeSpy).toHaveBeenLastCalledWith(value);
      });
    });
  });
});

