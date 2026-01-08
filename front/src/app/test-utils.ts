import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { vi } from 'vitest';

/**
 * Creates a test module with common providers for Angular 21 (no Zone.js)
 */
export function createTestModule(moduleDef: TestModuleMetadata = {}): TestModuleMetadata {
  return {
    ...moduleDef,
    providers: [
      ...(moduleDef.providers || []),
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideAnimations(),
    ],
  };
}

/**
 * Creates a component fixture with proper setup for Angular 21
 */
export async function createComponent<T>(
  component: new (...args: unknown[]) => T,
  moduleDef: TestModuleMetadata = {},
): Promise<ComponentFixture<T>> {
  const testModule = createTestModule(moduleDef);
  testModule.imports = [...(testModule.imports || []), component];

  await TestBed.configureTestingModule(testModule).compileComponents();

  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

/**
 * Helper to wait for async operations in Angular 21 (no Zone.js)
 */
export async function waitForAsync(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Helper to flush pending timers
 */
export function flushTimers(): void {
  vi.runAllTimers();
}

/**
 * Helper to advance timers by a specific amount
 */
export function advanceTimersBy(ms: number): void {
  vi.advanceTimersByTime(ms);
}

/**
 * Helper to create a mock signal
 */
export function createMockSignal<T>(initialValue: T) {
  return signal<T>(initialValue);
}

/**
 * Helper to get form control value
 */
export function getFormControlValue(form: AbstractControl, controlName: string): unknown {
  return form.get(controlName)?.value;
}

/**
 * Helper to set form control value
 */
export function setFormControlValue(form: AbstractControl, controlName: string, value: unknown): void {
  form.get(controlName)?.setValue(value);
  form.get(controlName)?.markAsDirty();
  form.get(controlName)?.markAsTouched();
}

/**
 * Helper to check if form control is invalid
 */
export function isFormControlInvalid(form: AbstractControl, controlName: string): boolean {
  const control = form.get(controlName);
  return control ? control.invalid && (control.dirty || control.touched) : false;
}

/**
 * Helper to get form control errors
 */
export function getFormControlErrors(form: AbstractControl, controlName: string): Record<string, unknown> | null {
  return form.get(controlName)?.errors ?? null;
}

