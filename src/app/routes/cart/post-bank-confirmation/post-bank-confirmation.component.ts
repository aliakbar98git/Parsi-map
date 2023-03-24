import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-bank-confirmation',
  templateUrl: './post-bank-confirmation.component.html',
  styleUrls: ['./post-bank-confirmation.component.scss']
})
export class PostBankConfirmationComponent implements OnInit {
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
