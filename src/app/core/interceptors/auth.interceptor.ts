import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/auth.service';

const withAuth = (req: HttpRequest<unknown>, token: string | null) =>
  req.clone({
    withCredentials: true,
    ...(token ? { setHeaders: { Authorization: `Bearer ${token}` } } : {}),
  });

/**
 * Access token expirado → backend responde 401. Renova pelo cookie de refresh
 * e repete a requisição uma vez. /auth/* fica de fora: lá o 401 é senha errada
 * ou refresh inválido, e tentar renovar entraria em loop.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(withAuth(req, authService.getAccessToken())).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => err);
      }
      return authService.refreshOnce().pipe(
        catchError(() => {
          authService.clearSession();
          return throwError(() => err);
        }),
        switchMap((tokens) => next(withAuth(req, tokens.accessToken))),
      );
    }),
  );
};
