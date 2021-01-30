import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { AuthService } from './auth.service'
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user.pipe(
      map((user) => {
        const isAdminAuth = user?.role === 'ADMIN'
        if (isAdminAuth) {
          return true
        }
        return this.router.createUrlTree(['/login'])
      })
    )
  }
}
