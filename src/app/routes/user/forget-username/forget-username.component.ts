import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { finalize } from 'rxjs/operators';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';
import { ForgetUsernameResult } from '../shared';

@Component({
  selector: 'app-forget-username',
  templateUrl: './forget-username.component.html',
  styleUrls: ['./forget-username.component.scss']
})
export class ForgetUsernameComponent implements OnInit {
  forgetUsernameForm: FormGroup;
  isSubmitted: boolean;
  @Output() onSuccessSubmit = new EventEmitter<ForgetUsernameResult & { mobileNumber }>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.forgetUsernameForm = this.formBuilder.group({
      mobileNumber: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });
  }

  onSubmit(): void {
    if (this.forgetUsernameForm.invalid) return;
    this.isSubmitted = true;
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams()
    .set('mobileNumber', this.mobileNumber.value);
      
    if (this.captchaService.captchaParams.showCaptcha) {
      formData = formData.set('DNTCaptchaText', this.captchaService.captchaParams.captcha.dntCaptchaTextValue)
      .set('DNTCaptchaToken', this.captchaService.captchaParams.captcha.dntCaptchaTokenValue)
      .set('DNTCaptchaInputText', this.DNTCaptchaInputText.value)
    }
    this.http.post<IResponse<ForgetUsernameResult>>(`${environment.apiUrl}/user/forgetusername`, formData, httpOptions)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        (response) => { this.onSuccessSubmit.emit({ ...response.data, mobileNumber: this.mobileNumber.value }) },
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

  get mobileNumber(): AbstractControl {
    return this.forgetUsernameForm.get("mobileNumber");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.forgetUsernameForm.get("DNTCaptchaInputText");
  }
}
