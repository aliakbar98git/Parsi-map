import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { finalize, tap } from 'rxjs/operators';
import * as moment from 'jalali-moment';
import { ICooperator, InvoiceGet, InvoiceGetResult, InvoiceReportFilter, InvoiceStatus } from '../shared';
import { faFileInvoice, faPrint, faCreditCard, faSearch, faTimes, faDownload, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Global, IResponse, LoadingService } from '@shared/.';
import { Observable } from 'rxjs';
import { IInvoice } from './../shared/_interfaces/invoice';
import { UserService, UserType } from '../../user/shared';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbCalendarPersian, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter, NgbDatepickerI18nPersian } from '@shared/_i18n/date-picker-persian';
import { ToastService } from '@shared/toast/toast.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class InvoiceListComponent implements OnInit {
  invoiceObject: InvoiceGetResult
  showLoading: boolean;
  faFileInvoice = faFileInvoice;
  faPrint = faPrint;
  faCreditCard = faCreditCard;
  faSearch = faSearch;
  faTimes = faTimes;
  faDownload = faDownload;
  faCalendar = faCalendar;
  invoiceStatus: typeof InvoiceStatus;
  pageNo: number;
  pageSize: number;
  params: InvoiceGet;
  global = Global;
  filterForm: FormGroup;
  statusList: InvoiceStatus[] = [];
  cooperators: ICooperator[];
  today = moment()
  maxDate: NgbDateStruct = { year: Number(this.today.format('jYYYY')), month: Number(this.today.format('jMM')), day: Number(this.today.format('jDD')) };

  constructor(
    private title: Title,
    private http: HttpClient,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private toastService: ToastService,
    public userService: UserService
  ) {
    this.showLoading = true;
    this.invoiceStatus = InvoiceStatus;
    for (var n in InvoiceStatus) {
      if (typeof InvoiceStatus[n] === 'number')
        this.statusList.push(parseInt(InvoiceStatus[n]));
    }
  }

  ngOnInit(): void {
    this.title.setTitle('لیست سفارشات');
    this.pageNo = 1;
    this.pageSize = 10;
    this.params = {
      pageNo: this.pageNo,
      pageSize: this.pageSize
    }

    this.filterForm = this.formBuilder.group({
      saleInvoiceNumber: [''],
      customerFullName: [''],
      startDate: ['', []],
      endDate: ['', []],
      status: ['all'],
      cooperatorId: ['all']
    }, { validators: this.dateLessThan('startDate', 'endDate') });

    this.getCooperators();

    this.activeRoute.queryParams.subscribe((routeParams) => {
      if (Object.keys(routeParams).length === 0 && routeParams.constructor === Object) {
        this.getInvoiceList().pipe(finalize(() => this.showLoading = false)).subscribe();
        return;
      }

      if (typeof routeParams.saleInvoiceNumber != "undefined") {
        this.saleInvoiceNumber.setValue(routeParams.saleInvoiceNumber);
      } else {
        this.saleInvoiceNumber.setValue('');
      }

      if (typeof routeParams.customerFullName != "undefined") {
        this.customerFullName.setValue(routeParams.customerFullName);
      } else {
        this.customerFullName.setValue('');
      }

      if (typeof routeParams.date != "undefined") {
        let from;
        switch (routeParams.date) {
          case 'today':
            from = moment().locale('fa');
            break;
          case 'week':
            from = moment().locale('fa').startOf('week')
            break;
          case 'month':
            from = moment().locale('fa').startOf('month');
            break;
        }
        from = { year: Number(from.format('jYYYY')), month: Number(from.format('jMM')), day: Number(from.format('jDD')) };
        this.startDate.setValue(from);
        this.endDate.setValue(this.maxDate);
      } else {
        this.startDate.setValue(null);
        this.endDate.setValue(null);
      }

      if (typeof routeParams.orderStatus != "undefined") {
        this.status.setValue(routeParams.orderStatus);
      } else {
        this.status.setValue('all');
      }

      this.filterInvoiceList();
    })
  }

  getCooperators() {
    if (this.userService.currentUser.userType == UserType.StoreManager)
      this.http.get<IResponse<ICooperator[]>>(`${environment.apiUrl}/Cooperator/GetCooperators`).subscribe(response => {
        this.cooperators = response.data;
      });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from].value;
      f = f != '' && f != null ? moment.from(`${f.year}/${f.month}/${f.day}`, 'fa', 'YYYY/MM/D').format('YYYY/MM/DD') : '';
      let t = group.controls[to].value;
      t = t != '' && t != null ? moment.from(`${t.year}/${t.month}/${t.day}`, 'fa', 'YYYY/MM/D').format('YYYY/MM/DD') : '';
      if (f > t && f != '' && t != '') {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }

  public get userType(): typeof UserType {
    return UserType
  }
  get saleInvoiceNumber(): AbstractControl {
    return this.filterForm.get("saleInvoiceNumber");
  }
  get customerFullName(): AbstractControl {
    return this.filterForm.get("customerFullName");
  }
  get startDate(): AbstractControl {
    return this.filterForm.get("startDate");
  }
  get endDate(): AbstractControl {
    return this.filterForm.get("endDate");
  }
  get status(): AbstractControl {
    return this.filterForm.get("status");
  }
  get cooperatorId(): AbstractControl {
    return this.filterForm.get("cooperatorId");
  }

  onPageChange() {
    this.getInvoiceList().pipe(finalize(() => this.showLoading = false)).subscribe();
  }

  private getInvoiceList(): Observable<IResponse<InvoiceGetResult>> {
    this.params.pageNo = this.pageNo;
    this.loadingService.showLoading();
    return this.http.get<IResponse<InvoiceGetResult>>(`${environment.apiUrl}/invoice/getinvoicelist`,
      { params: this.convertFilterParamsToHttpParams(this.params) })
      .pipe(tap(response => this.invoiceObject = response.data));
  }

  private convertFilterParamsToHttpParams(params: InvoiceGet | InvoiceReportFilter): HttpParams {
    let httpParams = new HttpParams();
    for (let [key, value] of Object.entries(params)) {
      if (value != null && value != '')
        httpParams = httpParams.set(key, value.toString());
    }
    return httpParams;
  }

  printInvoice(invoice: IInvoice) {
    window.open(`${environment.apiUrl}/Report/PrintReport?ReportName=SaleInvoice&SaleInvoiceId=${invoice.invoiceId}`, '_blank');
  }

  filterInvoiceList() {
    this.pageNo = 1;
    this.params.saleInvoiceNumber = this.saleInvoiceNumber.value;
    this.params.customerFullName = this.customerFullName.value;
    this.params.status = this.status.value == "all" ? null : this.status.value;
    this.params.cooperatorId = this.cooperatorId.value == "all" ? null : this.cooperatorId.value;



    const startDate = this.startDate.value;
    this.params.startDate = startDate != '' && startDate != undefined ? moment.from(`${startDate.year}/${startDate.month}/${startDate.day}`, 'fa', 'YYYY/MM/D').format('YYYY-M-D 00:00:00') : '';

    const endDate = this.endDate.value;
    this.params.endDate = endDate != '' && endDate != undefined ? moment.from(`${endDate.year}/${endDate.month}/${endDate.day}`, 'fa', 'YYYY/MM/D').format('YYYY-M-D 23:59:59') : '';

    if (this.filterForm.errors?.dates != undefined) {
      this.toastService.showDanger('لطفا تاریخ مناسب انتخاب نمایید.');
      return
    }
    if ((this.startDate.value != '' && this.endDate.value != '') || (this.startDate.value == '' && this.endDate.value == ''))
      this.getInvoiceList().pipe(finalize(() => this.showLoading = false)).subscribe();
    else
      this.toastService.showDanger('تاریخ شروع و پایان اجباری هستند.');
  }

  clearFilterInvoiceList() {
    this.saleInvoiceNumber.setValue(null);
    this.customerFullName.setValue(null);
    this.startDate.setValue('');
    this.endDate.setValue('');
    this.status.setValue('all');
    this.cooperatorId.setValue('all');

    this.startDate.markAsTouched();
    this.startDate.updateValueAndValidity();

    this.endDate.markAsTouched();
    this.endDate.updateValueAndValidity();

    this.filterInvoiceList();
  }

  exportToExcel() {
    window.open(`${environment.apiUrl}/Invoice/GetInvoiceListReport?${this.convertFilterParamsToHttpParams(this.params).toString()}`, '_blank');
  }

  exportToExcelFullData() {
    const reportParams: InvoiceReportFilter = {
      saleInvoiceNumber: this.params.saleInvoiceNumber || '',
      customerFullName: this.params.customerFullName || '',
      startDate: this.params.startDate || '',
      endDate: this.params.endDate || '',
      status: this.params.status || null,
      cooperatorId: this.params.cooperatorId || null
    };
    window.open(`${environment.apiUrl}/invoiceitem/getinvoiceitemreportexcel?${this.convertFilterParamsToHttpParams(reportParams).toString()}`, '_blank');
  }
}
