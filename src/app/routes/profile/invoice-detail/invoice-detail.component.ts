import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { UserService, UserType } from '../../user/shared';
import { InvoiceDetailGetResult, InvoiceFlowStatus, InvoicePayment, InvoiceStatus, ShippingPeriod } from '../shared';
import { faPrint, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { CartService } from './../../cart/shared/cart.service';
import { IResponse } from '@shared/.';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  invoiceDetail: InvoiceDetailGetResult;
  showLoading: boolean;
  userType: number;
  invoiceStatus: typeof InvoiceStatus;
  faPrint = faPrint;
  faCreditCard = faCreditCard;
  invoiceFlowStatus: typeof InvoiceFlowStatus;
  invoiceFlowSliderConfig: object;
  userTypes: typeof UserType;
  shippingPeriod: typeof ShippingPeriod;

  constructor(
    private title: Title,
    private http: HttpClient,
    private route: ActivatedRoute,
    public userService: UserService,
    private cartService: CartService
  ) {
    this.showLoading = true;
    this.userTypes = UserType;
  }

  ngOnInit(): void {
    this.title.setTitle('جزئیات سفارش');
    this.userType = this.userService.currentUser.userType;
    this.invoiceStatus = InvoiceStatus;
    this.invoiceFlowStatus = InvoiceFlowStatus;
    this.shippingPeriod = ShippingPeriod;
    this.getInvoiceDetail();

  }

  getInvoiceDetail() {
    const invoiceId = this.route.snapshot.paramMap.get('id');
    this.http.get<IResponse<InvoiceDetailGetResult>>(`${environment.apiUrl}/invoice/getinvoicecompletedata?invoiceId=${invoiceId}`)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe((response => {
        this.setSliderConfig(response.data.invoiceFlowMapper);
        this.invoiceDetail = response.data;
      }));
  }

  private setSliderConfig(invoiceFlow) {
    if (!invoiceFlow || invoiceFlow.finalInvoiceFlowStatus === 0) return;
    let numberOfActiveSlide = (invoiceFlow.invoiceFlowStatusList.indexOf(invoiceFlow.finalInvoiceFlowStatus)) + 1;

    this.invoiceFlowSliderConfig = {
      "slidesToShow": 5,
      "slidesToScroll": 1,
      "swipeToSlide": true,
      "infinite": false,
      "autoplay": false,
      "rtl": true,
      "initialSlide": this.getInitialSlide(5, numberOfActiveSlide),
      "responsive": [
        {
          "breakpoint": 1200,
          "settings": {
            "slidesToShow": 3,
            "initialSlide": this.getInitialSlide(3, numberOfActiveSlide)
          }
        },
        {
          "breakpoint": 768,
          "settings": {
            "slidesToShow": 2,
            "initialSlide": this.getInitialSlide(2, numberOfActiveSlide)
          }
        },
        {
          "breakpoint": 576,
          "settings": {
            "slidesToShow": 1,
            "initialSlide": numberOfActiveSlide - 1
          }
        }
      ],
      "prevArrow": `<div class="slick-prev slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" class="svg-inline--fa fa-caret-right fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg></div>`,
      "nextArrow": `<div class="slick-next slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-left" class="svg-inline--fa fa-caret-left fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg></div>`
    };
  }

  private getInitialSlide(slidesToShow: number, numberOfActiveSlide: number): number {
    let numberOfPack = Math.floor(numberOfActiveSlide / slidesToShow) - 1;
    if (numberOfPack < 0) return 0;
    return (numberOfPack * slidesToShow) + (numberOfActiveSlide % slidesToShow);
  }

  removePaymentItem(item: InvoicePayment) {
    this.cartService.removeInvoicePayment({ InvoiceId: item.invoiceId, PaymentId: item.id }).subscribe(() => {
      this.invoiceDetail = undefined;
      this.getInvoiceDetail();
    });
  }

  printInvoice() {
    window.open(`${environment.apiUrl}/Report/PrintReport?ReportName=SaleInvoice&SaleInvoiceId=${this.invoiceDetail.invoiceId}`, '_blank');
  }
}
