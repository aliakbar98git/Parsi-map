import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { Injectable } from '@angular/core';
import { IResponse } from '@shared/.';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  captchaParams: ICaptchaParams;

  constructor(private http: HttpClient) {
    this.resetCaptcha();
  }

  createCaptcha(path: string) {
    if (!path.startsWith('/'))
      path = `/${path}`;
    return this.http.get<IResponse<ICaptchaParams>>(`${environment.apiUrl}${path}`);
  }

  resetCaptcha(): void {
    this.captchaParams = {
      showCaptcha: false,
      captcha: null
    }
  }

  setCaptcha(captcha: ICaptchaParams): void {
    this.captchaParams = captcha;
  }

  getCaptcha(): ICaptchaParams {
    return this.captchaParams
  }
}
