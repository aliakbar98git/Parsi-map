import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { environment } from '@environments/environment';
import { ICityOrParish } from './../_interfaces/city-or-parish';
import { ToastService } from '@shared/toast/toast.service';
import { FavoriteProductToggle } from '@shared/_types/favorite-product-toggle';
import { IResponse } from '@shared/.';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private citiesSubject: BehaviorSubject<ICityOrParish[]>;
  cities: Observable<ICityOrParish[]>;
  getAddrestIdToMap: Subject<any> = new Subject();
  additionalAddressInfo: Subject<any> = new Subject();
  getLatLang: Subject<any> = new Subject();
  

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.citiesSubject = new BehaviorSubject<ICityOrParish[]>(null);
    this.cities = this.citiesSubject.asObservable();
    this.getCities().subscribe((response) =>
    this.citiesSubject.next(response.data)
    );
  }
  getNeighborhoodLocation(data): Observable<IResponse<any>> {

    return this.http.post<IResponse<any>>(
      `${environment.apiUrl}/GetAddressNeighborhoodLocation/NeighborhoodLocationController`,
      data
    );
  }




  toggleFavoriteItem(item: FavoriteProductToggle): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.apiUrl}/favorite/toggleProductFavorite`,
      item
    );
  }

  getCities(): Observable<IResponse<ICityOrParish[]>> {
    return this.http.get<IResponse<ICityOrParish[]>>(
      `${environment.apiUrl}/countryDivision/getCityOrParish`
    );
  }

  confirmMobileNumber(data): Observable<IResponse<void>> {
    //check the response
    return this.http.post<IResponse<void>>(
      `${environment.apiUrl}/user/confirmactivationphonenumbercode`,
      data
    );
  }

  resendSmsSecurityCode(id?: string): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.apiUrl}/user/resendsmssecuritycode`,
      id ? { userId: id } : {}
    );
  }
}
