import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mehr-ipg-confirmation',
  templateUrl: './mehr-ipg-confirmation.component.html',
  styleUrls: ['./mehr-ipg-confirmation.component.scss']
})
export class MehrIpgConfirmationComponent implements OnInit {
  @Output() onConfirmationButton: EventEmitter<void> = new EventEmitter();
  isConfirmed: boolean;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.isConfirmed = false;
  }

  onConfirmation () {
    this.isConfirmed = true;
    this.onConfirmationButton.emit();
  }
}
