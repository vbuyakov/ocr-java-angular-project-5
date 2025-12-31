import { Component } from '@angular/core';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormInputComponent, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

}
