import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterLegalUserComponent } from './register-legal-user/register-legal-user.component';
import { RegisterRealUserComponent } from './register-real-user/register-real-user.component';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { ConfirmMobileNumberComponent } from './confirm-mobile-number/confirm-mobile-number.component';
import { ForgetPasswordLayoutComponent } from './forget-password-layout/forget-password-layout.component';
import { ForgetPasswordByCodeComponent } from './forget-password-by-code/forget-password-by-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetUsernameLayoutComponent } from './forget-username-layout/forget-username-layout.component';
import { ForgetUsernameComponent } from './forget-username/forget-username.component';
import { ForgetUsernameByCodeComponent } from './forget-username-by-code/forget-username-by-code.component';
import { ResetUsernameComponent } from './reset-username/reset-username.component';
import { AcceptSitePolicyComponent } from './accept-site-policy/accept-site-policy.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { NationalCodeComponent } from './national-code/national-code.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    NgxMaskModule.forChild()
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    RegisterLegalUserComponent,
    RegisterRealUserComponent,
    ConfirmMobileNumberComponent,
    ForgetPasswordLayoutComponent,
    ForgetPasswordByCodeComponent,
    ResetPasswordComponent,
    ForgetUsernameLayoutComponent,
    ForgetUsernameComponent,
    ResetUsernameComponent,
    ForgetUsernameByCodeComponent,
    AcceptSitePolicyComponent,
    ConfirmEmailComponent,
    NationalCodeComponent
  ],
  exports: [
    RegisterRealUserComponent,
    RegisterLegalUserComponent
  ],
  providers:[NgbActiveModal]
})
export class UserModule { }
