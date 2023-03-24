import { Component, Input, OnInit, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { Global } from '@shared/global';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { IResponse } from '@shared/.';
import { CaptchaService } from '@shared/_services/captcha.service';


@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements OnInit {
  @Input() creatorPath: string;
  faRedo = faRedo;
  global = Global;

  @Output() captchaSetValue: EventEmitter<any> = new EventEmitter();
  @Output() captchaChangeValidators: EventEmitter<any> = new EventEmitter();
  isBrowser: boolean;

  constructor(
    public captchaService: CaptchaService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    if (this.isBrowser)
      this.captchaService.createCaptcha(this.creatorPath).subscribe((response: IResponse<ICaptchaParams>) => {
        this.captchaService.setCaptcha(response.data);        
        this.captchaChangeValidators.emit(this.captchaService.captchaParams.showCaptcha);
      });
  }
  setCaptchaValue(value: string) {
    this.captchaSetValue.emit(value);
  }

}
