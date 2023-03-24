import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IActiveUser } from '../../routes/user/shared/_interfaces/active-user';
import { UserService } from 'src/app/routes/user/shared';

@Component({
  selector: 'app-user-select-role',
  templateUrl: './user-select-role.component.html',
  styleUrls: ['./user-select-role.component.scss']
})
export class UserSelectRoleComponent implements OnInit {
  @Input() users: IActiveUser[];
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();

  constructor(
    private userService: UserService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void { }

  selectRole(item: IActiveUser) {
    this.userService.setUserRole(item.id ? item.id : item.userId, item.saleStructureUserId).subscribe(response => {
      this.userService.logInOutSubject.next(true);
      this.activeModal.dismiss();
      this.onSuccessSubmit.emit(response);
    });
  }
}
