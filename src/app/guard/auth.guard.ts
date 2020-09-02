import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UidService } from '../services/uid.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private uidService: UidService,
    private authService: AuthService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.checkUser()
      .then(async (uid) => {
        if (!uid) { 
          this.router.navigate(['/login'])
          return false
        }
        try {
          const checked = this.uidService.getAuthChecked()
          if (!checked) await this.authService.checkFireAuthTest()
          return true
        } catch (error) {
          console.log(error)
          alert(error)
          return false
        }
      })
  }

}
