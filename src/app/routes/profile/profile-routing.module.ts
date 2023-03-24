import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { FavoriteProductsListComponent } from './favorite-products-list/favorite-products-list.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { PrivateRoutesGuard } from '@shared/.';
import { AddressListComponent } from './address-list/address-list.component';
import { BankAccountInfoComponent } from './bank-account-info/bank-account-info.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateUsernameComponent } from './update-username/update-username.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { SalesCommissionComputingResultComponent } from './sales-commission-computing-result/sales-commission-computing-result.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [PrivateRoutesGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'update-username', component: UpdateUsernameComponent },
      { path: 'update-password', component: UpdatePasswordComponent },
      { path: 'personal-info', component: PersonalInfoComponent },
      { path: 'bank-account-info', component: BankAccountInfoComponent },
      { path: 'favorite-products-list', component: FavoriteProductsListComponent },
      { path: 'comment-list', component: CommentListComponent },
      { path: 'address-list', component: AddressListComponent },
      { path: 'invoice-list', component: InvoiceListComponent },
      { path: 'invoice-detail/:id', component: InvoiceDetailComponent },
      { path: 'sales-commission-computing-result', component: SalesCommissionComputingResultComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
