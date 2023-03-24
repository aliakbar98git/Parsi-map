import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Global, ILegalUser, IResponse, PasswordConfirmation } from '@shared/.';
import { Observable } from 'rxjs';
import { IActiveUser, LegalUserRegistration, UserService } from '../shared';
import { finalize } from 'rxjs/operators';
import { OrderService } from '../../product';
import { usernameValidator } from 'src/app/helpers';
import { ToastService } from '@shared/toast/toast.service';
import { ICustomer } from './../../cart/shared/cart.model';
import { LegalUserComponent } from '@shared/legal-user/legal-user.component';
import { PasswordConfirmationComponent } from '@shared/password/password-confirmation.component';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';

@Component({
  selector: 'app-register-legal-user',
  templateUrl: './register-legal-user.component.html',
  styleUrls: ['./register-legal-user.component.scss']
})
export class RegisterLegalUserComponent implements OnInit {
  @Input() selfRegister: boolean = true;
  registerLegalUserForm: FormGroup;
  isSubmitted: boolean;
  global = Global;
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();
  @ViewChild('legalUserFormComponent') legalUserFormRef: LegalUserComponent;
  @ViewChild('passwordFormComponent') passwordFormRef: PasswordConfirmationComponent;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private toastService: ToastService,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('ثبت نام شخص حقوقی');
    const formItems: any = {
      legalUserFields: [null],
      acceptedPolicy: [false, this.selfRegister ? Validators.requiredTrue : null]
    }
    if (this.selfRegister) {
      formItems.username = ['', [
        Validators.required,
        Validators.minLength(3),
        usernameValidator()]];
      formItems.passwordFields = [null];
      formItems.DNTCaptchaInputText = ['', {
        Validators: [
          Validators.required
        ]
      }]
    }
    this.registerLegalUserForm = this.formBuilder.group(formItems);
  }

  onSubmit(): void {
    this.showValidations();
    if (this.registerLegalUserForm.invalid || this.isSubmitted) {
      this.toastService.showDanger('لطفا فیلدهای مشخص شده را تکمیل نمایید.')
      return;
    }
    this.isSubmitted = true;
    const params: LegalUserRegistration = {
      ...this.legalUserFields,
      representativePersonNationalCode: !this.legalUserFields.representativePersonIsForeign ? this.legalUserFields.representativePersonNationalCode : null,
      representativePersonForeignerIdentityCode: this.legalUserFields.representativePersonIsForeign ? this.legalUserFields.representativePersonForeignerIdentityCode : null,
      acceptedPolicy: this.acceptedPolicy.value,
      selfRegister: this.selfRegister
    }
    if (this.selfRegister) {
      params.username = this.username.value;
      params.password = this.passwordFields.password;
      params.confirmPassword = this.passwordFields.confirmPassword;

      if (this.captchaService.captchaParams.showCaptcha) {
        params.DNTCaptchaText = this.captchaService.captchaParams.captcha.dntCaptchaTextValue;
        params.DNTCaptchaToken = this.captchaService.captchaParams.captcha.dntCaptchaTokenValue;
        params.DNTCaptchaInputText = this.DNTCaptchaInputText.value;
      }

      this.registerLegalUser(params)
        .pipe(finalize(() => this.isSubmitted = false))
        .subscribe(
          (response) => {
            const responseData = response.data;
            this.userService.currentUser = responseData;
            this.userService.isAuthenticated = true;
            this.orderService.sendLogInEvent();
            this.router.navigate(['user/confirm-mobile-number']);
          },
          ({error}) => {
            const captchaParams: ICaptchaParams = {
              showCaptcha: error.data.showCaptcha,
              captcha: error.data.captcha,
            }
            this.captchaService.setCaptcha(captchaParams);
            this.captchaChangeValidators(this.captchaService.captchaParams.showCaptcha);
          }
        );
    } else {
      this.registerLegalUserBySeller(params)
        .pipe(finalize(() => this.isSubmitted = false))
        .subscribe(response => { this.onSuccessSubmit.emit(response.data) });
    }
  }

  registerLegalUser(data: LegalUserRegistration): Observable<IResponse<IActiveUser>> {
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams();
    for (let key in data) {
      if (data[key] != null && data[key] != '') formData = formData.set(key, data[key]);
    }
    return this.http.post<IResponse<IActiveUser>>(`${environment.apiUrl}/user/registerLegalUser`, formData, httpOptions)
  }

  registerLegalUserBySeller(data: LegalUserRegistration): Observable<IResponse<ICustomer>> {
    return this.http.post<IResponse<ICustomer>>(`${environment.apiUrl}/user/RegisterLegalUseBySeller`, data)
  }

  captchaSetValue(value: string) {
    this.DNTCaptchaInputText.setValue(value);
    this.DNTCaptchaInputText.markAsTouched();
  }

  captchaChangeValidators(status: boolean) {
    if (status == true) {
      this.DNTCaptchaInputText.setValidators([Validators.required]);
      if (!this.DNTCaptchaInputText.touched)
        this.DNTCaptchaInputText.setErrors({ required: true });
    } else {
      this.DNTCaptchaInputText.clearValidators();
      this.DNTCaptchaInputText.setErrors(null)
    }
  }

  get legalUserFields(): ILegalUser {
    return this.registerLegalUserForm.get('legalUserFields').value;
  }

  get username(): AbstractControl {
    return this.registerLegalUserForm.get("username");
  }

  get passwordFields(): PasswordConfirmation {
    return this.registerLegalUserForm.get("passwordFields").value;
  }

  get acceptedPolicy(): AbstractControl {
    return this.registerLegalUserForm.get("acceptedPolicy");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.registerLegalUserForm.get("DNTCaptchaInputText");
  }

  showValidations() {
    this.legalUserFormRef.showValidations();
    if (this.passwordFormRef)
      this.passwordFormRef.showValidations();

    this.registerLegalUserForm.markAllAsTouched();
  }
}
