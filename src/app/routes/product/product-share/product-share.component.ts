import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import { faLinkedinIn, faGooglePlusG, faFacebookF, faTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '@shared/toast/toast.service';

@Component({
  selector: 'app-product-share',
  templateUrl: './product-share.component.html',
  styleUrls: ['./product-share.component.scss']
})
export class ProductShareComponent implements OnInit {
  @Input() productModel: string;
  productUrl: string;
  faLinkedinIn = faLinkedinIn;
  faGooglePlusG = faGooglePlusG;
  faFacebookF = faFacebookF;
  faTwitter = faTwitter;
  faTelegram = faTelegram;
  faWhatsapp = faWhatsapp;
  faCopy = faCopy;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public activeModal: NgbActiveModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.productUrl = `${this.document.location.origin}/product/${encodeURI(this.productModel)}`;
  }

  copyToClipboard(inputElementRef: HTMLInputElement): void {
    inputElementRef.select();
    inputElementRef.setSelectionRange(0, 99999);
    document.execCommand("copy");
    this.toastService.showInfo('لینک صفحه کپی شد.');
  }

}
