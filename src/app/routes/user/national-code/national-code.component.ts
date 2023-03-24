import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Global, IResponse } from '@shared/.';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { CaptchaService } from '@shared/_services/captcha.service';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-national-code',
  templateUrl: './national-code.component.html',
  styleUrls: ['./national-code.component.scss']
})
export class NationalCodeComponent implements OnInit {
  nationalCodeForm: FormGroup;
  isSubmitted: boolean;
  global = Global;
  faInfoCircle = faInfoCircle;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService,

  ) { }

  ngOnInit(): void {
    this.title.setTitle('کد ملی');
    this.nationalCodeForm = this.formBuilder.group({
      nationalCode: ['', Validators.required],
      acceptedPolicy: [false, Validators.requiredTrue],
      DNTCaptchaInputText: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.nationalCodeForm.invalid) return;
    this.isSubmitted = true;
    const params = { ...this.nationalCodeForm.value };
    if (this.captchaService.captchaParams.showCaptcha) {
      params.DNTCaptchaText = this.captchaService.captchaParams.captcha.dntCaptchaTextValue;
      params.DNTCaptchaToken = this.captchaService.captchaParams.captcha.dntCaptchaTokenValue;
      params.DNTCaptchaInputText = this.DNTCaptchaInputText.value;
    }
    const httpOptios = {
      headers: new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' })
    }
    let formData = new HttpParams();
    for (let key in params) {
      formData = formData.set(key, params[key]);
    }
    this.http.post<IResponse>(`${environment.apiUrl}/user/registerUserByNationalCode`, formData, httpOptios)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe((response) => {
      }, ({ error }) => {
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
  get nationalCode(): AbstractControl {
    return this.nationalCodeForm.get("nationalCode");
  }
  get acceptedPolicy(): AbstractControl {
    return this.nationalCodeForm.get("acceptedPolicy");
  }
  get DNTCaptchaInputText(): AbstractControl {
    return this.nationalCodeForm.get("DNTCaptchaInputText");
  }

}
