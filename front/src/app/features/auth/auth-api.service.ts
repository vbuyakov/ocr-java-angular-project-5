import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/api/api.service';
import { MessageResponse } from '@core/api/api-types';

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly apiService = inject(ApiService);

  register(request: RegistrationRequest): Observable<MessageResponse> {
    return this.apiService.post<MessageResponse>('/auth/register', request);
  }
}

