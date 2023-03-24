import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component, EventEmitter, Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  Validators
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Global, IRealUser, IResponse, PasswordConfirmation } from '@shared/.';
import { PasswordConfirmationComponent } from '@shared/password/password-confirmation.component';
import { RealUserComponent } from '@shared/real-user/real-user.component';
import { ToastService } from '@shared/toast/toast.service';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { usernameValidator } from 'src/app/helpers';
import { OrderService } from '../../product';
import {
  IActiveUser, RealUserRegistration,
  UserService
} from '../shared';
import { ICustomer } from './../../cart/shared/cart.model';


@Component({
  selector: 'app-register-real-user',
  templateUrl: './register-real-user.component.html',
  styleUrls: ['./register-real-user.component.scss'],
})
export class RegisterRealUserComponent implements OnInit {
  @Input() selfRegister: boolean = true;
  registerRealUserForm: FormGroup;
  isSubmitted: boolean;
  faInfoCircle = faInfoCircle;
  visibleValidators: boolean;
  global = Global;
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();
  @ViewChild('realUserFormComponent') realUserFormRef: RealUserComponent;
  @ViewChild('passwordFormComponent')
  passwordFormRef: PasswordConfirmationComponent;
  registerCustomerModalRef;
  customerSelected: ICustomer;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private toastService: ToastService,
    private captchaService: CaptchaService,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('ثبت نام شخص حقیقی');
    const formItems: any = {
      realUserFields: [null],
      acceptedPolicy: [
        false,
        this.selfRegister ? Validators.requiredTrue : null,
      ],
    };
    if (this.selfRegister) {
      formItems.username = [
        '',
        [Validators.required, Validators.minLength(3), usernameValidator()],
      ];
      formItems.passwordFields = [null];
      formItems.DNTCaptchaInputText = [
        '',
        {
          Validators: [Validators.required],
        },
      ];
    }
    this.registerRealUserForm = this.formBuilder.group(formItems);
  }

  onSubmit(): void {
    this.showValidations();
    if (this.registerRealUserForm.invalid || this.isSubmitted) {
      this.toastService.showDanger('لطفا فیلدهای مشخص شده را تکمیل نمایید.');
      return;
    }
    this.isSubmitted = true;
    const params: RealUserRegistration = {
      ...this.realUserFields,
      nationalCode: !this.realUserFields.isForeign
        ? this.realUserFields.nationalCode
        : null,
    
      foreignerIdentityCode: this.realUserFields.isForeign
        ? this.realUserFields.foreignerIdentityCode
        : null,
      acceptedPolicy: this.acceptedPolicy.value,
      selfRegister: this.selfRegister,
      
    };
    if (this.selfRegister) {
      params.username = this.username.value;
      params.password = this.passwordFields.password;
      params.confirmPassword = this.passwordFields.confirmPassword;

      if (this.captchaService.captchaParams.showCaptcha) {
        params.DNTCaptchaText =
          this.captchaService.captchaParams.captcha.dntCaptchaTextValue;
        params.DNTCaptchaToken =
          this.captchaService.captchaParams.captcha.dntCaptchaTokenValue;
        params.DNTCaptchaInputText = this.DNTCaptchaInputText.value;
      }

      this.registerRealUser(params)
        .pipe(finalize(() => (this.isSubmitted = false)))
        .subscribe(
          (response) => {
            const responseData = response.data;
            this.userService.currentUser = responseData;
            this.userService.isAuthenticated = true;
            this.orderService.sendLogInEvent();
            this.router.navigate(['user/confirm-mobile-number']);
          },
          ({ error }) => {
            const captchaParams: ICaptchaParams = {
              showCaptcha: error.data.showCaptcha,
              captcha: error.data.captcha,
            };
            this.captchaService.setCaptcha(captchaParams);
            this.captchaChangeValidators(
              this.captchaService.captchaParams.showCaptcha
            );
          }
        );
    } else {
      this.registerRealUserBySeller(params)
        .pipe(finalize(() => (this.isSubmitted = false)))
        .subscribe((response) => {
          this.onSuccessSubmit.emit(response.data);
          
        });
    }
  }

  registerRealUser(
    data: RealUserRegistration
  ): Observable<IResponse<IActiveUser>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/x-www-form-urlencoded',
      }),
    };
    let formData = new HttpParams();
    for (let key in data) {
      if (data[key] != null && data[key] != '')
        formData = formData.set(key, data[key]);
    }
    return this.http.post<IResponse<IActiveUser>>(
      `${environment.apiUrl}/user/registerRealUser`,
      formData,
      httpOptions
    );
  }

  registerRealUserBySeller(
    data: RealUserRegistration
  ): Observable<IResponse<ICustomer>> {
    return this.http.post<IResponse<ICustomer>>(
      `${environment.apiUrl}/user/RegisterRealUserBySeller`,
      data
    );
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
      this.DNTCaptchaInputText.setErrors(null);
    }
  }

  showValidations() {
    this.realUserFormRef.showValidations();
    if (this.passwordFormRef) this.passwordFormRef.showValidations();

    this.registerRealUserForm.markAllAsTouched();
  }

  get realUserFields(): IRealUser {
    return this.registerRealUserForm.get('realUserFields').value;
  }

  get username(): AbstractControl {
    return this.registerRealUserForm.get('username');
  }
  get customerId(): AbstractControl {
    return this.registerRealUserForm.get('customerId');
  }

  get passwordFields(): PasswordConfirmation {
    return this.registerRealUserForm.get('passwordFields').value;
  }

  get acceptedPolicy(): AbstractControl {
    return this.registerRealUserForm.get('acceptedPolicy');
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.registerRealUserForm.get('DNTCaptchaInputText');
  }
}
