import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/entities/user.service';
import { catchError, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getUserFromCache();

  //Vérification du user dans le cache
  if(user) {
    return true;
  }

  //Sinon tentative de chargement depuis l'API
  return userService.getConnectedUserFromApi().pipe(
    take(1),
    map((user) => {
      return !!user; 
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false); 
    })
  );
};
