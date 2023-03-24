import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './routes/errors';
import { ProductListComponent, PromotedListComponent, ProductDetailComponent, CompareComponent } from './routes/product';
import { PrivateRoutesGuard } from './shared';
import { PagesComponent } from './routes/pages/pages.component';
import { HomeComponent } from './routes/home/home/home.component';
import { ContactUsComponent } from './routes/contact-us/contact-us.component';
import { OrganizationalSaleComponent } from './routes/organizational-sale/organizational-sale.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { UnderConstructionComponent } from './routes/under-construction/under-construction.component';
import { WorldCupComponent } from './routes/world-cup/world-cup.component';

const routes: Routes = [
  { path: 'under-construction', component: UnderConstructionComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'category/:code', component: ProductListComponent },
      { path: 'search/:keyword', component: ProductListComponent },
      { path: 'promoted-product', component: PromotedListComponent },
      { path: 'product/:model/:name', component: ProductDetailComponent },
      { path: 'product/:model', component: ProductDetailComponent },
      { path: 'page/organizational-sale', component: OrganizationalSaleComponent },
      { path: 'page/contact-us', component: ContactUsComponent },
      { path: 'page/:name', component: PagesComponent },
      { path: 'compare', component: CompareComponent },
      { path: 'worldcup', component: WorldCupComponent },
      { path: 'user', loadChildren: () => import('./routes/user/user.module').then(m => m.UserModule) },
      { path: 'profile', loadChildren: () => import('./routes/profile/profile.module').then(m => m.ProfileModule), canLoad: [PrivateRoutesGuard] },
      { path: 'cart', loadChildren: () => import('./routes/cart/cart.module').then(m => m.CartModule), canLoad: [PrivateRoutesGuard] },
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
