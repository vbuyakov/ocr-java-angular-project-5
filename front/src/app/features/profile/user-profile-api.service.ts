import { Injectable, inject } from '@angular/core';
import {Observable} from 'rxjs';
import {UserProfileResponseDto} from '@features/profile/dtos/user-profile-response.dto';
import {ApiService} from '@core/api/api.service';
import {UserProfileRequestDto} from '@features/profile/dtos/user-profile-request.dto';

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
    private readonly apiService = inject(ApiService);
    getProfile(): Observable<UserProfileResponseDto> {
        return this.apiService.get('/user/profile');
    }

  updateProfile(userProfile: UserProfileRequestDto):Observable<UserProfileResponseDto> {
        userProfile.password = userProfile.password?.trim().length ? userProfile.password.trim() : undefined;

        return this.apiService.put('/user/profile', userProfile);
  }

}
