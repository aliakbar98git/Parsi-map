import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Global, SharedService } from '@shared/.';
import { finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../product';
import { UserLogin, UserService } from '../shared';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';
import { ToastService } from '@shared/toast/toast.service';
import { UserSelectRoleComponent } from '@shared/user-select-role/user-select-role.component';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted: boolean;
  isGiSeller: boolean = false;
  isBrowser: boolean;
  selectRoleModalRef: any;
  global = Global;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private orderService: OrderService,
    private captchaService: CaptchaService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.title.setTitle('ورود به گلدیران');
    this.loginForm = this.formBuilder.group({
      username: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }],
      password: ['', {
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      }],
      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });
    if (this.isBrowser)
      this.isGiSeller = environment.isSellerSite;
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.invalid || this.isSubmitted) {
      this.toastService.showDanger('لطفا فیلدهای مشخص شده را تکمیل نمایید.')
      return;
    }
    this.isSubmitted = true;
    
    const params: UserLogin = {
      ...this.loginForm.value,
      password: this.password.value
    };
    

    if (this.captchaService.captchaParams.showCaptcha) {
      params.DNTCaptchaText = this.captchaService.captchaParams.captcha.dntCaptchaTextValue;
      params.DNTCaptchaToken = this.captchaService.captchaParams.captcha.dntCaptchaTokenValue;
      params.DNTCaptchaInputText = this.DNTCaptchaInputText.value;
    }

    this.userService.logIn(params)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe((response) => {
        if (response.data.users == null) {
          this.submitUserLogin(response.data.confirmedMobile);
        } else {
          this.selectRoleModalRef = this.modalService.open(UserSelectRoleComponent, { centered: true, backdrop: 'static' });
          this.selectRoleModalRef.componentInstance.onSuccessSubmit.subscribe((response) => this.onSelectUserSuccessSubmit(response));
          this.selectRoleModalRef.componentInstance.users = response.data.users;
        }
      }, ({error}) => {
        const captchaParams: ICaptchaParams = {
          showCaptcha: error.data.showCaptcha,
          captcha: error.data.captcha,
        }
        this.captchaService.setCaptcha(captchaParams);
        this.captchaChangeValidators(this.captchaService.captchaParams.showCaptcha);
      });
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

  onSelectUserSuccessSubmit(response: any) {
    this.submitUserLogin(response.data.confirmedMobile);
  }

  submitUserLogin(confirmedMobile: boolean) {
    this.orderService.sendLogInEvent();
    if (confirmedMobile) {
      this.router.navigate(['/']);
    } else {
      this.sharedService.resendSmsSecurityCode().subscribe();
      this.router.navigate(['user/confirm-mobile-number']);
    }
  }

  get username(): AbstractControl {
    return this.loginForm.get("username");
  }

  get password(): AbstractControl {
    return this.loginForm.get("password");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.loginForm.get("DNTCaptchaInputText");
  }

}
