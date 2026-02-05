import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const token = authService.getAccessToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

