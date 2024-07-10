import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isEmployer = localStorage.getItem('employer') === 'true';
    if (next.routeConfig?.path === 'new-employee' && !isEmployer) {
      this.router.navigate(['/welcome']);
      return false;
    }
    return true;
  }
}
