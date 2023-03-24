import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IActiveUser } from './../../user/shared/_interfaces/active-user';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.scss']
})
export class RegisterCustomerComponent implements OnInit {
  registerReal: boolean = false;
  registerLegal: boolean = false;
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onCreateUser(user: IActiveUser) {
    this.onSuccessSubmit.emit(user);
  }
}
