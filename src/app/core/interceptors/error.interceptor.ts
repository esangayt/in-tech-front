import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud inválida. Por favor verifica los datos.';
            if (error.error) {
              const errors = [];
              for (const key in error.error) {
                if (Array.isArray(error.error[key])) {
                  errors.push(`${key}: ${error.error[key].join(', ')}`);
                } else {
                  errors.push(`${key}: ${error.error[key]}`);
                }
              }
              if (errors.length > 0) {
                errorMessage = errors.join('\n');
              }
            }
            break;
          case 401:
            errorMessage = 'No autorizado. Por favor inicia sesión.';
            authService.logout();
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message}`;
        }
      }

      console.error('Error HTTP:', error);

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};

