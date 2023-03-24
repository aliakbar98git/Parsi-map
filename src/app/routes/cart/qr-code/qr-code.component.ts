import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../shared';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QRCodeComponent implements OnInit {

  @Input() qrValue: string;
  @Input() InvoiceId: string;
  @Input()  data: any;

  @Output() onClose = new EventEmitter();
  @Output() stt = new EventEmitter();
  @Output() newQrCode = new EventEmitter();

  report;
  status: number = -1;
  constructor(
    public activeModal: NgbActiveModal,
    private cartService: CartService,

  ) { }

  ngOnInit(): void {}
  inquiry() {
    this.cartService.getInvoiceBillSummary(this.InvoiceId).subscribe((response) => {
      this.report = response.data.invoicePayments.find(v => v.creditPaymentMethod === 12);
      this.status = +this.report.resultCode;
      this.stt.next(response.data.invoicePayments);
    });
  }
  payInvoice() {
    this.data.InvoiceId = this.InvoiceId;
    this.cartService.payInvoice(this.data).subscribe((response) => {
      this.newQrCode.next(response.data.qrCodeValue);
      this.qrValue = response.data.qrCodeValue;
    });
  }
  onCloseModal() {
    this.activeModal.dismiss();
    this.onClose.emit();
  }



}
