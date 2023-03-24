import { ErrorHandler, NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ServerTransferStateModule } from '@angular/platform-server';
import seqLogger from '../logger';
import { UniversalInterceptor } from './shared/_interceptors/universal.interceptor';

export class ServerErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error: any) {
    seqLogger.error({ error: error }, 'SSR Error Handler. Error: {error}');
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ServerErrorHandler
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
