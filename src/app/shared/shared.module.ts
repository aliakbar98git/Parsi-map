import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConcatProductNamePipe } from './_pipes/concat-product-name.pipe';
import { JalaliPipe } from './_pipes/jalali.pipe';
import { CitySelectDirective } from './_directives/city-select.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PasswordConfirmationComponent } from './password/password-confirmation.component';
import { RateComponent } from './rate/rate.component';
import { ImageComponent } from './image/image.component';
import { ToastsContainer } from './toast/toasts-container.component';
import { LoadingInlineComponent } from './loading-inline/loading-inline.component';
import { Loading } from './loading/loading.component';
import { LegalUserComponent } from './legal-user/legal-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { RealUserComponent } from './real-user/real-user.component';
import { UsernameComponent } from './username/username.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { ResendSmsSecurityCodeComponent } from './resend-sms-security-code/resend-sms-security-code.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ConvertNumbersToEnglishDirective } from './_directives/convert-numbers-to-english.directive';
import { MaskErrorDirective } from './_directives/mask-error.directive';
import { SafeHtmlPipe } from './_pipes/safe-html.pipe';
import { TranslatePipe } from './_pipes/translate.pipe';
import { UserSelectRoleComponent } from './user-select-role/user-select-role.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forChild()
  ],
  declarations: [
    ConcatProductNamePipe,
    TranslatePipe,
    JalaliPipe,
    SafeHtmlPipe,
    RateComponent,
    CitySelectDirective,
    ConfirmationDialogComponent,
    PasswordConfirmationComponent,
    ImageComponent,
    ToastsContainer,
    LoadingInlineComponent,
    Loading,
    LegalUserComponent,
    RealUserComponent,
    UsernameComponent,
    PaymentHistoryComponent,
    CaptchaComponent,
    ResendSmsSecurityCodeComponent,
    UploadFileComponent,
    ConvertNumbersToEnglishDirective,
    MaskErrorDirective,
    UserSelectRoleComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ConcatProductNamePipe,
    TranslatePipe,
    JalaliPipe,
    SafeHtmlPipe,
    RateComponent,
    CitySelectDirective,
    ConfirmationDialogComponent,
    PasswordConfirmationComponent,
    ImageComponent,
    ToastsContainer,
    LoadingInlineComponent,
    Loading,
    LegalUserComponent,
    RealUserComponent,
    UsernameComponent,
    PaymentHistoryComponent,
    CaptchaComponent,
    ResendSmsSecurityCodeComponent,
    UploadFileComponent,
    ConvertNumbersToEnglishDirective,
    MaskErrorDirective,
    UserSelectRoleComponent,
  ]
})
export class SharedModule { }
