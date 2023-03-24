import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { IResponse } from '@shared/.';

@Component({
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  subscription: Subscription;
  userId: string;
  code: string;
  message: string;
  messageClass: string;
  isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      this.userId = params.userId;
      this.code = params.code;

      if (this.isBrowser)
        this.confirmActivationEmailCode();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  confirmActivationEmailCode() {
    this.http.post<IResponse>(`${environment.apiUrl}/user/ConfirmActivationEmailCode/${this.userId}/${this.code}`, {})
      .subscribe(
        response => {
          this.message = response.message;
          this.messageClass = "text-success";
        },
        ({error}) => {
          this.message = error.message;
          this.messageClass = "text-danger";
        }
      );
  }
}
