import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/toast/toast.service';
import { LoadingService, StatusCode, TranslateService } from '@shared/.';
import { IResponse } from '@shared/.';

@Injectable()
export class ResponseIntercept implements HttpInterceptor {
  constructor(
    public router: Router,
    public toastService: ToastService,
    private loadingService: LoadingService,
    private translateService: TranslateService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          this.loadingService.hideLoading();
          if (event instanceof HttpResponse && event.body?.messageCode) {
            const message = this.translateService.translateCode(event.body.messageCode, event.body.messageParameters);
            event.body.statusCode === StatusCode.Success ? this.toastService.showSuccess(message) : this.toastService.showWarning(message);
            event.body.message = message;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          const innerError: IResponse = error.error ? error.error : {statusCode: 1, messageCode: 0, message: null, messageParameters: null, data: null};
          let message: string;
          message = this.translateService.translateCode(innerError.messageCode, innerError.messageParameters);
          if (!message) {
            message = this.translateService.translateCode(error.status, null);
            message = message ? message : `خطایی رخ داده است. لطفاً دوباره تلاش کنید و در صورت بروز مجدد خطا با پشتیبانی تماس بگیرید.(${error.status})`;
          }
          innerError.message = message;
          switch (error.status) {
            case 500:
            case 502:
              this.toastService.showDanger(message);
              break;
            case 503:
              break;
            default:
              this.toastService.showWarning(message);
          }
          switch (error.status) {
            case 401:
              this.router.navigateByUrl("/user/login");
              break;
            case 403:
              this.router.navigateByUrl("/");
              break;
            case 503:
              this.router.navigateByUrl("/under-construction", { skipLocationChange: true });
              break;
          }
          const outterError = Object.assign(error);
          outterError.error = innerError;
          return throwError(outterError);
        })
      );
  }
}
