import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/api/api.service';
import { MessageResponse } from '@core/api/api-types';
import { RegistrationRequest } from './dtos/registration-request.dto';
import { LoginRequest } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiService = inject(ApiService);

  register(request: RegistrationRequest): Observable<MessageResponse> {
    return this.apiService.post<MessageResponse>('/auth/register', request);
  }

  login(request: LoginRequest): Observable<LoginResponseDto> {
    return this.apiService.post<LoginResponseDto>('/auth/login', request);
  }
}

