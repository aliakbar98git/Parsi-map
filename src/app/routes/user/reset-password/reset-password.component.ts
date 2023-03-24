import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse, PasswordConfirmation } from '@shared/.';
import { finalize } from 'rxjs/operators';
import { CaptchaService } from '@shared/_services/captcha.service';
import { ICaptchaParams } from '@shared/_interfaces/captcha';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isSubmitted: boolean;
  @Input() userId: string;
  @Output() onSuccessSubmit = new EventEmitter<void>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      code: ['', Validators.required],
      passwordFields: [null],
      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;
    this.isSubmitted = true;
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams()
      .set('userId', this.userId)
      .set('code', this.code.value)
      .set('password', this.passwordFields.password)
      .set('confirmPassword', this.passwordFields.confirmPassword);
    
    if (this.captchaService.captchaParams.showCaptcha) {
      formData = formData.set('DNTCaptchaText', this.captchaService.captchaParams.captcha.dntCaptchaTextValue)
      .set('DNTCaptchaToken', this.captchaService.captchaParams.captcha.dntCaptchaTokenValue)
      .set('DNTCaptchaInputText', this.DNTCaptchaInputText.value)
    }
    this.http.post<IResponse>(`${environment.apiUrl}/user/resetpassword`, formData, httpOptions)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        () => this.onSuccessSubmit.emit(),
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

  get code(): AbstractControl {
    return this.resetPasswordForm.get("code");
  }

  get passwordFields(): PasswordConfirmation {
    return this.resetPasswordForm.get("passwordFields").value;
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.resetPasswordForm.get("DNTCaptchaInputText");
  }
}
