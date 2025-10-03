import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
export const authGuardGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  const token=sessionStorage.getItem('token')
  if(token){
    return true;
  }
  else{
    alert('Login to continue')
   return router.createUrlTree(['/']);
  }
};
