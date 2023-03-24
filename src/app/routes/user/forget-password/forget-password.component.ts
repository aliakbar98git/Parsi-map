import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';
import { finalize } from 'rxjs/operators';
import { ForgetPasswordResult } from '../shared/_types/forget-password-result';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  isSubmitted: boolean;
  @Output() onSuccessSubmit = new EventEmitter<ForgetPasswordResult & { mobileNumber }>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      usernameOrMobileNumber: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }],
      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });
  }

  onSubmit(): void {
    if (this.forgetPasswordForm.invalid) return;
    this.isSubmitted = true;
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams()
    .set('usernameOrMobileNumber', this.usernameOrMobileNumber.value);
      
    if (this.captchaService.captchaParams.showCaptcha) {
      formData = formData.set('DNTCaptchaText', this.captchaService.captchaParams.captcha.dntCaptchaTextValue)
      .set('DNTCaptchaToken', this.captchaService.captchaParams.captcha.dntCaptchaTokenValue)
      .set('DNTCaptchaInputText', this.DNTCaptchaInputText.value)
    }
    this.http.post<IResponse<ForgetPasswordResult>>(`${environment.apiUrl}/User/ForgetPassword`, formData, httpOptions)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        (response) => { this.onSuccessSubmit.emit({ ...response.data, mobileNumber: this.usernameOrMobileNumber.value }) },
        ({error}) => {
          const captchaParams: ICaptchaParams = {
            showCaptcha: error.data.showCaptcha,
            captcha: error.data.captcha,
          }
          this.captchaService.setCaptcha(captchaParams);
          this.captchaChangeValidators(this.captchaService.captchaParams.showCaptcha);
        }
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
      this.DNTCaptchaInputText.setErrors(null)
    }
  }

  get usernameOrMobileNumber(): AbstractControl {
    return this.forgetPasswordForm.get("usernameOrMobileNumber");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.forgetPasswordForm.get("DNTCaptchaInputText");
  }
}
