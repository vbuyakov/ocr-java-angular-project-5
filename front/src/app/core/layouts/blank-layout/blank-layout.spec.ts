import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlankLayout } from './blank-layout';

describe('BlankLayout', () => {
  let component: BlankLayout;
  let fixture: ComponentFixture<BlankLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlankLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlankLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
