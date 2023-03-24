import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { CaptchaService } from '@shared/_services/captcha.service';
import { finalize } from 'rxjs/operators';
import { ForgetPasswordByCodeResult } from '../shared/_types/forget-password-by-code-result';

@Component({
  selector: 'app-forget-password-by-code',
  templateUrl: './forget-password-by-code.component.html',
  styleUrls: ['./forget-password-by-code.component.scss']
})
export class ForgetPasswordByCodeComponent implements OnInit {
  forgetPasswordByCodeForm: FormGroup;
  isSubmitted: boolean;
  @Input() mobileNumber: string;
  @Output() onSuccessSubmit = new EventEmitter<ForgetPasswordByCodeResult>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) { }

  ngOnInit(): void {
    this.forgetPasswordByCodeForm = this.formBuilder.group({
      nationalCodeOrNationalId: ['', [
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
    if (this.forgetPasswordByCodeForm.invalid) return;
    this.isSubmitted = true;
    const httpOptions = {
      headers: new HttpHeaders({'content-type': 'application/x-www-form-urlencoded'})
    }
    let formData = new HttpParams()
      .set('nationalCodeOrNationalId', this.nationalCodeOrNationalId.value)
      .set('mobileNumber', this.mobileNumber);
      
    if (this.captchaService.captchaParams.showCaptcha) {
      formData = formData.set('DNTCaptchaText', this.captchaService.captchaParams.captcha.dntCaptchaTextValue)
      .set('DNTCaptchaToken', this.captchaService.captchaParams.captcha.dntCaptchaTokenValue)
      .set('DNTCaptchaInputText', this.DNTCaptchaInputText.value)
    }
    this.http.post<IResponse<ForgetPasswordByCodeResult>>(`${environment.apiUrl}/user/forgetpasswordbasedoncode`, formData, httpOptions)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        (response) => { this.onSuccessSubmit.emit(response.data) }
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

  get nationalCodeOrNationalId(): AbstractControl {
    return this.forgetPasswordByCodeForm.get("nationalCodeOrNationalId");
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.forgetPasswordByCodeForm.get("DNTCaptchaInputText");
  }
}
