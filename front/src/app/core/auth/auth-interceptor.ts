import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = inject(AuthService).getToken();
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });
  
  return next(newRequest);
};
