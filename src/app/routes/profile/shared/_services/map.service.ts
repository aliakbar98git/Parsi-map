import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IResponse } from '@shared/.';
import { Observable } from 'rxjs';
import { AddressRemove } from '../_types/address-remove';

@Injectable()
export class MapService {
  constructor(private http: HttpClient) {
  }

  areaInfo(item: any): Observable<IResponse<null>> {
    return this.http.post<IResponse<null>>(`${environment.apiUrl}/AreaInfo/AreaInfoAddress`, item)
  }


}
