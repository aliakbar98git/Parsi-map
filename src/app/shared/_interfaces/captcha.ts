export interface ICaptcha {
  dntCaptchaId: string;
  dntCaptchaImgUrl: string;
  dntCaptchaTextValue: string;
  dntCaptchaTokenValue: string;
}

export interface ICaptchaParams {
  captcha: ICaptcha;
  showCaptcha: boolean;
}
