import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { finalize } from 'rxjs/operators';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';
import { ForgetUsernameByCodeResult } from '../shared';

@Component({
  selector: 'app-forget-username-by-code',
  templateUrl: './forget-username-by-code.component.html',
  styleUrls: ['./forget-username-by-code.component.scss']
})
export class ForgetUsernameByCodeComponent implements OnInit {
  forgetUsernameByCodeForm: FormGroup;
  isSubmitted: boolean;
  @Input() mobileNumber: string;
  @Output() onSuccessSubmit = new EventEmitter<ForgetUsernameByCodeResult>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.forgetUsernameByCodeForm = this.formBuilder.group({
      nationalCode: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });
  }

  onSubmit(): void {
    if (this.forgetUsernameByCodeForm.invalid) return;
    this.isSubmitted = true;
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams()
      .set('nationalCode', this.nationalCode.value)
      .set('mobileNumber', this.mobileNumber);
      
    if (this.captchaService.captchaParams.showCaptcha) {
      formData = formData.set('DNTCaptchaText', this.captchaService.captchaParams.captcha.dntCaptchaTextValue)
      .set('DNTCaptchaToken', this.captchaService.captchaParams.captcha.dntCaptchaTokenValue)
      .set('DNTCaptchaInputText', this.DNTCaptchaInputText.value)
    }
    this.http.post<IResponse<ForgetUsernameByCodeResult>>(`${environment.apiUrl}/User/ForgetUsernameBasedOnCode`, formData, httpOptions)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        (response) => { this.onSuccessSubmit.emit(response.data) },
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

  get nationalCode(): AbstractControl {
    return this.forgetUsernameByCodeForm.get("nationalCode");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.forgetUsernameByCodeForm.get("DNTCaptchaInputText");
  }
}
