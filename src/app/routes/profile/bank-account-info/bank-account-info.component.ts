import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IBankAccount, Bank } from '../shared';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isbnValidator } from 'src/app/helpers';
import { Global, IResponse } from '@shared/.';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bank-account-info',
  templateUrl: './bank-account-info.component.html',
  styleUrls: ['./bank-account-info.component.scss']
})
export class BankAccountInfoComponent implements OnInit {
  bankAccountInfoUpdateForm: FormGroup;
  isSubmitted: boolean;
  bankAccountInfo: IBankAccount;
  bankItems: Bank[];
  showLoading: boolean;
  bankItemsLoading: boolean;
  global = Global;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.isSubmitted = false;
    this.showLoading = true;
    this.bankItemsLoading = true;
  }

  ngOnInit(): void {
    this.title.setTitle('اطلاعات بانکی');
    this.bankAccountInfoUpdateForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      shebaNumber: ['', [Validators.required, Validators.minLength(26), Validators.maxLength(26), isbnValidator()]],
      bankId: [null, Validators.required]
    });
    this.getBankList();
    this.getBankAccountInfo();
  }

  getBankList(): void {
    this.http.get<IResponse<Bank[]>>(`${environment.apiUrl}/bank/getBanks`)
      .pipe(finalize(() => this.bankItemsLoading = false))
      .subscribe(
        response => this.bankItems = response.data
      );
  }

  getBankAccountInfo(): void {
    this.http.get<IResponse<IBankAccount>>(`${environment.apiUrl}/bankAccountInfo/getBankAccountInfo`)
      .pipe(finalize(()=> this.showLoading = false))
      .subscribe(response => {
        this.bankAccountInfo = response.data;
        if (response.data) this.updateFormValues(response.data);
      });
  }

  updateFormValues(bankAccountInfo: IBankAccount): void {
    this.bankAccountInfoUpdateForm.setValue({
      accountNumber: bankAccountInfo.accountNumber,
      shebaNumber: bankAccountInfo.shebaNumber,
      bankId: bankAccountInfo.bankId
    });
    this.bankAccountInfoUpdateForm.markAllAsTouched();
  }

  onSubmit(): void {
    if (this.bankAccountInfoUpdateForm.invalid) return;
    this.isSubmitted = true;
    const updateInfo = {
      ...this.bankAccountInfo,
      accountNumber: this.accountNumber.value,
      shebaNumber: this.shebaNumber.value,
      bankId: this.bankId.value
    }

    this.http.post<IResponse>(`${environment.apiUrl}/bankAccountInfo/modifyBankAccountInfo`,  updateInfo)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        () => this.router.navigate(['/profile'])
      );
  }

  get accountNumber(): AbstractControl {
    return this.bankAccountInfoUpdateForm.get("accountNumber");
  }

  get shebaNumber(): AbstractControl {
    return this.bankAccountInfoUpdateForm.get("shebaNumber");
  }

  get bankId(): AbstractControl {
    return this.bankAccountInfoUpdateForm.get("bankId");
  }

}
