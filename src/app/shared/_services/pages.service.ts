import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IPage } from './../_interfaces/pages';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '..';

@Injectable({
  providedIn: 'root'
})
export class PagesService {


  constructor(private http: HttpClient) { }

  getPageDetail(name: string): Observable<IResponse<IPage>> {
    return this.http.get<IResponse<IPage>>(`${environment.apiUrl}/Page/GetPageDetail/${name}`);
  }
}
