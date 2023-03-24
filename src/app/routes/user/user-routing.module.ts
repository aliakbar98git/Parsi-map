import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PrivateRoutesGuard, PublicRoutesGuard } from '@shared/.';
import { RegisterRealUserComponent } from './register-real-user/register-real-user.component';
import { RegisterLegalUserComponent } from './register-legal-user/register-legal-user.component';
import { ConfirmMobileNumberComponent } from './confirm-mobile-number/confirm-mobile-number.component';
import { ForgetPasswordLayoutComponent } from './forget-password-layout/forget-password-layout.component';
import { ForgetUsernameLayoutComponent } from './forget-username-layout/forget-username-layout.component';
import { AcceptSitePolicyComponent } from './accept-site-policy/accept-site-policy.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { NationalCodeComponent } from './national-code/national-code.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      { path: '', redirectTo: 'real', pathMatch: 'full' },
      { path: 'real', component: RegisterRealUserComponent },
      { path: 'legal', component: RegisterLegalUserComponent }
    ]
  },
  { path: 'confirm-mobile-number', component: ConfirmMobileNumberComponent, canActivate: [PrivateRoutesGuard] },
  { path: 'confirm-email/:userId/:code', component: ConfirmEmailComponent },
  { path: 'forget-password', component: ForgetPasswordLayoutComponent, canActivate: [PublicRoutesGuard] },
  { path: 'forget-username', component: ForgetUsernameLayoutComponent, canActivate: [PublicRoutesGuard] },
  { path: 'accept-site-policy', component: AcceptSitePolicyComponent, canActivate: [PrivateRoutesGuard] },
  { path: 'mehr', component: NationalCodeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
