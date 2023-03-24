import { Inject, Injectable, Optional } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {
  constructor(@Optional() @Inject(REQUEST) protected request: Request) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.replace(environment.apiUrl, environment.apiUniversalUrl);
    const serverRequest = req.clone({ url });
    return next.handle(serverRequest);
  }
}
