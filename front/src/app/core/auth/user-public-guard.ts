import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const userPublicGuard: CanActivateFn = () => {
  if(!inject(AuthService).isAuthenticated())
  {
    return true;
  }
  
  return inject(Router).createUrlTree(["/articles"]);
};
