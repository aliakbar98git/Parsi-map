import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ICart, ICartKeys, IDeleteFromCart, IOfferInvoiceShipping, IPayInvoiceResult, IPaymentInfo, IPaymentInfoParams, IPaymentResult, IPaymentResultParam, IPayParams, IShippingAddress, IShippingParams, IDiscountCheckParams, ICustomer, IUpdateNationalCodeParams, ISetCustomerInfoParams, IShippingSellerInfo, IInvoiceBillSummary, IRemoveInvoicePaymentParams } from './cart.model';
import { IResponse, LoadingService } from '@shared/.';


@Injectable()
export class CartService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }


  getCart() {
    return this.http.get<IResponse<ICart>>(`${environment.apiUrl}/OrderInfo/GetCart`, {});
  }

  deleteFromCart(params: IDeleteFromCart) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<ICart>>(`${environment.apiUrl}/OrderInfo/DeleteFromCart`, params, this.httpOptions);
  }

  deleteAllCart() {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/OrderInfo/DeleteAllCart`, {}, this.httpOptions);
  }

  getShippingPersonAddressInfo(personId?: number) {
    let url: string = `${environment.apiUrl}/personAddressInfo/GetShippingPersonAddressInfo`;
    if (personId != undefined && personId != null)
      url += `?personId=${personId}`;
    return this.http.get<IResponse<IShippingAddress>>(url);
  }

  getOfferInvoiceShipping(addressInfoId: number) {
    let httpParams = new HttpParams().set("PersonAddressInfoId", '' + addressInfoId);
    return this.http.get<IResponse<IOfferInvoiceShipping[]>>(`${environment.apiUrl}/InvoiceShipping/OfferInvoiceShipping`, { params: httpParams });
  }

  submitShipping(param: IShippingParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<ICartKeys>>(`${environment.apiUrl}/OrderInfo/SetInvoiceTemporaryData`, param, this.httpOptions);
  }

  getPaymentInfo(param: IPaymentInfoParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<IPaymentInfo>>(`${environment.apiUrl}/Payment/GetPaymentInfo`, param, this.httpOptions);
  }

  payInvoice(param: IPayParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<IPayInvoiceResult>>(`${environment.apiUrl}/Payment/PayInvoice`, param, this.httpOptions);
  }

  getInvoiceBillSummary(invoiceId: string) {
    return this.http.get<IResponse<IInvoiceBillSummary>>(`${environment.apiUrl}/Payment/GetInvoiceBillSummary?invoiceId=${invoiceId}`);
  }

  removeInvoicePayment(param: IRemoveInvoicePaymentParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<IInvoiceBillSummary>>(`${environment.apiUrl}/Payment/DeleteInvoicePayment`, param, this.httpOptions);
  }

  getPaymentResult(param: IPaymentResultParam) {
    return this.http.post<IResponse<IPaymentResult>>(`${environment.apiUrl}/Payment/GetPaymentResult`, param, this.httpOptions);
  }

  checkDiscountCode(param: IDiscountCheckParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/DiscountProvider/CheckDiscountCode`, param, this.httpOptions);
  }

  removeDiscountCode(invoiceShippingTempKey: string, customerId: number) {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/DiscountProvider/RemoveDiscountCode`, { InvoiceShippingTempKey: invoiceShippingTempKey, CustomerId: customerId }, this.httpOptions);
  }

  checkCustomer(criteria: string) {
    this.loadingService.showLoading();
    return this.http.get<IResponse<ICustomer[]>>(`${environment.apiUrl}/OrderInfo/CheckCustomer?Criteria=${criteria}`);
  }

  updateRealPersonNationalCode(param: IUpdateNationalCodeParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/Person/UpdateRealPersonNationalCode`, param, this.httpOptions);
  }

  setOrderCustomerInfo(param: ISetCustomerInfoParams) {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/OrderInfo/SetOrderCustomerInfo`, param, this.httpOptions);
  }

  getSellerExtraData(invoiceTempKey: string) {
    this.loadingService.showLoading();
    return this.http.get<IResponse<IShippingSellerInfo>>(`${environment.apiUrl}/OrderInfo/GetSellerExtraData?InvoiceTempKey=${invoiceTempKey}`);
  }

}
