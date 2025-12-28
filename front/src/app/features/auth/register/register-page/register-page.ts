import { Component } from '@angular/core';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [FormInputComponent, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

}
