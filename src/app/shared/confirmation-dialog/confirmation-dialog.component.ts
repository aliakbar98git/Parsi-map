import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  @Output() onConfirmationButton: EventEmitter<any> = new EventEmitter();
  isConfirmed: boolean;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.isConfirmed = false;
  }

  onConfirmation () {
    this.isConfirmed = true;
    this.onConfirmationButton.emit(this.data);
  }
}
