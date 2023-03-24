import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { RealPersonalInfoComponent } from './real-personal-info/real-personal-info.component';
import { FavoriteProductsListComponent } from './favorite-products-list/favorite-products-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AddressListComponent } from './address-list/address-list.component';
import { AddressDetailComponent } from './address-detail/address-detail.component';
import { BankAccountInfoComponent } from './bank-account-info/bank-account-info.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateUsernameComponent } from './update-username/update-username.component';
import { ProfileService } from './shared';
import { LegalPersonalInfoComponent } from './legal-personal-info/legal-personal-info.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { ConfirmMobileNumberModalComponent } from './confirm-mobile-number-modal/confirm-mobile-number-modal.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CartService } from '../cart/shared';
import { SalesCommissionComputingResultComponent } from './sales-commission-computing-result/sales-commission-computing-result.component';
import { OpenlComponent } from './openl/openl.component';


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    PersonalInfoComponent,
    RealPersonalInfoComponent,
    FavoriteProductsListComponent,
    CommentListComponent,
    AddressListComponent,
    OpenlComponent,
    AddressDetailComponent,
    BankAccountInfoComponent,
    UpdatePasswordComponent,
    UpdateUsernameComponent,
    LegalPersonalInfoComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
    ConfirmMobileNumberModalComponent,
    SalesCommissionComputingResultComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule,
    NgSelectModule,
    NgxMaskModule.forChild(),
    NgbModule,
    SlickCarouselModule,
  ],
  providers: [
    ProfileService,
    CartService
  ]
})
export class ProfileModule { }
