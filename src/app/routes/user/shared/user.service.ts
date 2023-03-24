import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment';

import { IActiveUser, UserLogin } from '.';
import { IUserStatus } from './user.model';
import { IResponse } from '@shared/.';


@Injectable()
export class UserService {
  currentUser: IActiveUser;
  isAuthenticated: boolean;
  logInOutSubject = new Subject<boolean>();
  currentUserSubject = new Subject<any>();
  UserParentOfCheckCustomer = new Subject<any>();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getCurrentUser(): Observable<IResponse<IUserStatus>> {
    return this.http.get<IResponse<IUserStatus>>(`${environment.apiUrl}/User/Status`).pipe(
      tap((response) => {
        this.currentUser = response.data.isAuthenticated ? <IActiveUser>response.data.user : null;
        this.isAuthenticated = response.data.isAuthenticated;
        this.currentUserSubject.next(this.currentUser);
      })
    );
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  logIn(user: UserLogin): Observable<IResponse<IActiveUser>> {
    const httpOptios = {
      headers: new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' })
    }
    let formData = new HttpParams();
    for (let key in user) {
      formData = formData.set(key, user[key]);
    }
    return this.http.post<IResponse<IActiveUser>>(`${environment.apiUrl}/User/LogIn`, formData, httpOptios).pipe(
      tap((response) => {
        this.setCurrentUser(response);
      })
    );
  }

  logOut() {
    return this.http.post(`${environment.apiUrl}/User/Logout`, {});
  }

  logOutAction() {
    this.currentUser = null;
    this.currentUserSubject.next(this.currentUser);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }

  setUserRole(userId: string, saleStructureUserId: number) {
    return this.http.post<IResponse<IActiveUser>>(`${environment.apiUrl}/User/SetUser`, {
      UserId: userId,
      SaleStructureUserId: saleStructureUserId
    }).pipe(
      tap((response) => {
        this.setCurrentUser(response);
      })
    );
  }

  private setCurrentUser(response: IResponse<IActiveUser>) {
    if (response.data.users == null) {
      this.currentUser = response.data;
      this.isAuthenticated = true;
    }
  }

  getUserRoles() {
    return this.http.get<IResponse<any>>(`${environment.apiUrl}/user/GetUserRoles`);
  }

}
