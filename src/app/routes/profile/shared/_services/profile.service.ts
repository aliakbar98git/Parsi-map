import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AddressGet, AddressRemove, RealPersonInfoGet, LegalPersonInfoGet, SalesCommissionBaseInfo } from '..';
import { ICustomer } from './../../../cart/shared/cart.model';
import { IResponse } from '@shared/.';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {
  }

  getRealPersonalInfo(editBySeller: boolean = false, customerSelected: ICustomer = null): Observable<IResponse<RealPersonInfoGet>> {
    const path = editBySeller ? `Customer/GetRealCustomer?id=${customerSelected.customerId}` : 'User/GetRealUserProfile';
    return this.http.get<IResponse<RealPersonInfoGet>>(`${environment.apiUrl}/${path}`)
  }

  getLegalPersonalInfo(editBySeller: boolean = false, customerSelected: ICustomer = null): Observable<IResponse<LegalPersonInfoGet>> {
    const path = editBySeller ? `Customer/GetLegalCustomer?id=${customerSelected.customerId}` : 'User/GetLegalPerson';
    return this.http.get<IResponse<LegalPersonInfoGet>>(`${environment.apiUrl}/${path}`)
  }

  getAddressList(): Observable<IResponse<AddressGet[]>> {
    return this.http.get<IResponse<AddressGet[]>>(`${environment.apiUrl}/personAddressInfo/getPersonAddressInfo`)
  }

  removeAddress(item: AddressRemove): Observable<IResponse<null>> {
    return this.http.post<IResponse<null>>(`${environment.apiUrl}/personAddressInfo/DeletePersonAddress`, item)
  }

  getSalesCommissionComputingResultBaseInfo(): Observable<IResponse<SalesCommissionBaseInfo[]>> {
    return this.http.get<IResponse<SalesCommissionBaseInfo[]>>(`${environment.apiUrl}/SalesCommissionComputingResult/GetSalesCommissionComputingResultInfo`)
  }
}
