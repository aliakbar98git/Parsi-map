import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faCaretUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserType } from 'src/app/routes/user/shared';
import { UserService } from './../../routes/user/shared/user.service';
import { InvoiceStatus } from 'src/app/routes/profile/shared';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  faCaretUp = faCaretUp;
  faSearch = faSearch;
  invoiceStatus: typeof InvoiceStatus;
  userType: typeof UserType;
  admibNavIsCollapsed: boolean;
  isBrowser: boolean;
  saleInvoiceNumber: FormControl = new FormControl('');
  customerFullName: FormControl = new FormControl('');


  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public userService: UserService,
    private router: Router,
  ) {
    this.invoiceStatus = InvoiceStatus;
    this.userType = UserType;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.admibNavIsCollapsed = true;
  }

  scrollTop() {
    (function smoothscroll() {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

  searchConsumer() {
    const params: any = {};

    if (this.saleInvoiceNumber.value != '')
      params.saleInvoiceNumber = this.saleInvoiceNumber.value;

    if (this.customerFullName.value != '')
      params.customerFullName = this.customerFullName.value;

    if (Object.keys(params).length === 0) return;

    this.router.navigate(['/profile/invoice-list'], {
      queryParams: params
    });
  }
}
