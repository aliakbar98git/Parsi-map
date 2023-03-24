import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/routes/user/shared';

@Injectable({
  providedIn: 'root'
})
export class PublicRoutesGuard implements CanActivate, CanLoad {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    if (this.userService.isAuthenticated) {
      return false;
    } else {
      return this.userService.getCurrentUser().pipe(map(response => {
        if (response.data.isAuthenticated) {
          this.router.navigate(['profile']);
          return false;
        } else {
          return true;
        }
      }));
    }
  }

  canLoad(): Observable<boolean> | boolean {
    return this.canActivate();
  }
}
