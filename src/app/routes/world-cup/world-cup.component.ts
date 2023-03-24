import { ViewportScroller } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { faBars, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Global, IResponse } from '@shared/.';
import { ToastService } from '@shared/toast/toast.service';
import { ICaptchaParams } from '@shared/_interfaces/captcha';
import { CaptchaService } from '@shared/_services/captcha.service';


@Component({
  selector: 'app-world-cup',
  templateUrl: './world-cup.component.html',
  styleUrls: ['./world-cup.component.scss']
})
export class WorldCupComponent implements OnInit {
  weeks: string[];
  winners: { fullName: string, phoneNumber: string }[];
  loadMore = false;
  menuOpen = false;
  activeWeek: number;
  date: any;
  faBars = faBars;
  faTimes = faTimes;
  now: any;
  isWinner = false;
  winnerUser;
  faStar = faStar;
  searchForm: FormGroup
  global = Global;
  isSubmitted: boolean;
  loadAllImages = false;
  targetDate: any = new Date(2022, 11, 6);
  targetTime: any = this.targetDate.getTime();
  difference: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = `${this.months[this.targetDate.getMonth()]
    } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;
  @ViewChild('days', { static: true }) days: ElementRef;
  @ViewChild('hours', { static: true }) hours: ElementRef;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;


  constructor(
    private scroller: ViewportScroller,
    private captchaService: CaptchaService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastService: ToastService,



  ) { }

  ngOnInit(): void {
    this.activeWeek = 0;
    // this.weeks = ['هفته اول', 'هفته دوم', 'هفته سوم', 'هفته چهارم', 'هفته پنجم', 'هفته ششم', 'هفته هفتم', 'هفته هشتم'];
    this.weeks = ['هفته اول', 'هفته دوم', 'هفته سوم'];
    this.searchForm = this.formBuilder.group({
      PhoneNumber: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)]],

      DNTCaptchaInputText: ['', {
        Validators: [
          Validators.required
        ]
      }]
    });

    // let httpParams = new HttpParams().set("campaignType", 1);
    // this.http.get<IResponse>(`${environment.apiUrl}/Campaign/GetCampaignLotteryDate`, { params: httpParams }).subscribe(
    //   (response: any) => {
    //     this.targetDate = new Date(response.data.lotteryDate);
    //     this.targetTime = this.targetDate.getTime();
    //     this.currentTime = `${this.months[this.targetDate.getMonth() - 1]
    //       } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;
    //     // this.syncDate();
    //   }
    // );


    this.getWinnersList();
  }
  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      this.difference = this.difference / (1000 * 60 * 60 * 24);

      !isNaN(this.days.nativeElement.innerText)
        ? (this.days.nativeElement.innerText = Math.floor(this.difference))
        : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    }, 1000);
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 22 - this.date.getHours();
    this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
    this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
  }
  onSelectedMenu(title: string): void {
    this.scroller.scrollToAnchor(title);
  }
  replacePhone(phone: string): string {
    const replaced = phone.replace(/X/g, "-");
    return replaced;

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
  get DNTCaptchaInputText(): AbstractControl {
    return this.searchForm.get("DNTCaptchaInputText");
  }
  get PhoneNumber(): AbstractControl {
    return this.searchForm.get("PhoneNumber");
  }

  onSubmit(): void {
    this.searchForm.markAllAsTouched()
    if (this.searchForm.invalid || this.isSubmitted) {
      this.toastService.showDanger('لطفا فیلدهای مشخص شده را تکمیل نمایید.')
      return;
    }
    this.isSubmitted = true;
    const params = this.searchForm.value;
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
    this.http.post<IResponse>(`${environment.apiUrl}/Campaign/GetCampaignWinner`, formData, httpOptios).subscribe((response) => {
      this.isSubmitted = false;
      this.isWinner = true;
      this.PhoneNumber.setValue('');
      this.winnerUser = response.data.winner[0];
      const captchaParams: ICaptchaParams = {
        showCaptcha: response.data.showCaptcha,
        captcha: response.data.captcha,
      }
      this.captchaService.setCaptcha(captchaParams);
      this.captchaChangeValidators(this.captchaService.captchaParams.showCaptcha);
    }
    );
  }
  loadLessMore(path: string) {
    if (path === 'winners') {
      if (this.loadMore) {
        this.onSelectedMenu('winners');
      }
      this.loadMore = !this.loadMore;
    }
    if (path === 'archive') {
      if (this.loadAllImages) {
        this.onSelectedMenu('archive');
      }
      this.loadAllImages = !this.loadAllImages;
    }

  }

  getWinnersList() {
    let httpParams = new HttpParams()
      .set('Period', this.activeWeek + 1)
      .set("CampaignType", 1);

    this.http.get<IResponse>(`${environment.apiUrl}/Campaign/GetCampaignWinnerByPeriodAndType`, { params: httpParams }).subscribe(
      (response) => {
        this.winners = response.data;
      }
    );
  }
  changeActiveWeek(index: number) {
    this.activeWeek = index;
    this.getWinnersList();
  }
}
