import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

import { UserPermission } from '../../../../../shared/permissions';

// tslint:disable-next-line:no-unsafe-any - false positive
@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor (private readonly authService: AuthenticationService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(map(currentUser => {
      if (currentUser !== undefined) {
        // test if user has permission listed in route.data.requiredPermission
        if (typeof route.data.requiredPermission === 'string'
          && currentUser.hasPermission(route.data.requiredPermission as UserPermission)) return true;
        // test if user has all permissions listen in route.data.requiredPermissions
        else if (Array.isArray(route.data.requiredPermissions)
          && route.data.requiredPermissions.every((role: any) => currentUser.hasPermission(role as UserPermission))) return true;
        // test if no requiredPermission or requiredPermissions are needed
        else if (typeof route.data.requiredRole !== 'string' && !Array.isArray(route.data.requiredRoles)) return true;
      }

      // redirect to login page with the return url or to unauthorized page
      currentUser === undefined ? this.router.navigate(['/login']) : this.router.navigate(['/unauthorized']);

      return false;
    }));
  }
}

// tslint:disable-next-line:no-unsafe-any - false positive
@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedHttpInterceptor implements HttpInterceptor {
  constructor (private readonly authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(() => {}, error => {
        if (error instanceof HttpErrorResponse && error.status === 401) this.authService.clearUserData(); // tslint:disable-line:no-magic-numbers
      }),
    );
  }
}
