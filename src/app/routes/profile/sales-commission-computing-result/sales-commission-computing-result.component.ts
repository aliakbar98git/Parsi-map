import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { faPrint, faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Global } from '@shared/.';
import { ProfileService, SalesCommissionBaseInfo } from '../shared';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-commission-computing-result',
  templateUrl: './sales-commission-computing-result.component.html',
  styleUrls: ['./sales-commission-computing-result.component.scss']
})
export class SalesCommissionComputingResultComponent implements OnInit {
  showLoading: boolean;
  baseInfo: SalesCommissionBaseInfo[] = [];
  filterForm: FormGroup;
  monthsList: number[] = [];
  faPrint = faPrint;
  faTimes = faTimes;
  faDownload = faDownload;
  global = Global;

  constructor(
    private title: Title,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
  ) {
    this.showLoading = true;
    
  }

  ngOnInit(): void {
    this.title.setTitle('کارمزد فروش حق العمل کاری');
    this.filterForm = this.formBuilder.group({
      year: [null, [Validators.required]],
      month: [null, [Validators.required]]
    });
    this.getBaseInfo();
  }

  getBaseInfo() {
    this.showLoading = true;
    this.profileService.getSalesCommissionComputingResultBaseInfo()
    .pipe(finalize(() => this.showLoading = false))
    .subscribe(({ data }) => {
      this.baseInfo = data;
    });
  }

  setMonth(selectedValue: SalesCommissionBaseInfo) {
    if (!selectedValue) {
      this.monthsList = [];
      this.month.setValue(null);
      return;
    }
    this.monthsList = selectedValue.months;
  }

  private convertFilterParamsToHttpParams(): string {
    let httpParams = new HttpParams();
    for (let [key, value] of Object.entries(this.filterForm.value)) {
      if (value != null && value != '')
        httpParams = httpParams.set(key, value.toString());
    }
    return httpParams.toString();
  }

  clearFilter() {
   this.filterForm.setValue({
     year: null,
     month: null
   });
   this.monthsList = [];
  }

  exportToExcel() {
    window.open(`${environment.apiUrl}/Report/PrintSalesCommissionComputingResultReport?${this.convertFilterParamsToHttpParams()}`, '_blank');
  }

  exportToExcelFullData() {
    window.open(`${environment.apiUrl}/SalesCommissionComputingResult/GetSalesCommissionComputingResultReportExcel?${this.convertFilterParamsToHttpParams()}`, '_blank');
  }

  exportToExcelDetailData() {
    window.open(`${environment.apiUrl}/SalesCommissionComputingResult/GetSalesCommissionComputingResultDetailReportExcel?${this.convertFilterParamsToHttpParams()}`, '_blank');
  }

  get year(): AbstractControl {
    return this.filterForm.get("year");
  }
  get month(): AbstractControl {
    return this.filterForm.get("month");
  }
}
