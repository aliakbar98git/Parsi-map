import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/routes/user/shared';

@Injectable({
  providedIn: 'root'
})
export class PrivateRoutesGuard implements CanActivate, CanLoad {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    if (this.userService.isAuthenticated) {
      return true;
    } else {
      return this.userService.getCurrentUser().pipe(map(response => {
        if (response.data.isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['user/login']);
          return true;
        }
      }));
    }
  }

  canLoad(): Observable<boolean> | boolean {
    return this.canActivate();
  }
}
