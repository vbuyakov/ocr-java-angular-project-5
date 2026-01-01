import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/api/api.service';
import { MessageResponse } from '@core/api/api-types';
import { RegistrationRequest } from './dtos/registration-request.dto';
import { LoginRequest } from './dtos/login-request.dto';
import { LoginResponse } from './dtos/login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiService = inject(ApiService);

  register(request: RegistrationRequest): Observable<MessageResponse> {
    return this.apiService.post<MessageResponse>('/auth/register', request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', request);
  }
}

