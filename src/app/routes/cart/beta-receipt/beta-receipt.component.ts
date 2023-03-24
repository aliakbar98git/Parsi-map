import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-beta-receipt',
  templateUrl: './beta-receipt.component.html',
  styleUrls: ['./beta-receipt.component.scss']
})
export class BetaReceiptComponent implements OnInit {
  @Input() data: any;
  @Output() onSuccessSubmit = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  acceptReceipt(): void {
    this.onSuccessSubmit.emit({ payAmount: this.data.betaCreditPaymentAmount });
    this.activeModal.dismiss();
  }

}
