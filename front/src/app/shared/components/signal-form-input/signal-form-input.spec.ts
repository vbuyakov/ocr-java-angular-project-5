import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalFormInput } from './signal-form-input';

describe('SignalFormInput', () => {
  let component: SignalFormInput;
  let fixture: ComponentFixture<SignalFormInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalFormInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
