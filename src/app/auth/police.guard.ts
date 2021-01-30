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
export class PoliceGuard implements CanActivate {
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
        const isPoliceAuth = user?.role === 'POLICE'
        if (isPoliceAuth) {
          return true
        }
        return this.router.createUrlTree(['/login'])
      })
    )
  }
}
