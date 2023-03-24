import { Component, OnInit } from '@angular/core';
import {
  faUser,
  faSignOutAlt,
  faListAlt,
  faAddressBook,
  faHeart,
  faComment,
  faTachometerAlt,
  faUniversity,
  faKey,
  faUserCircle,
  faCaretDown,
  faCaretUp
} from '@fortawesome/free-solid-svg-icons';
import { OrderService } from '../../product';
import { UserService, UserType } from '../../user/shared';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isConsumer: boolean;
  isManager: boolean;
  profilePanelIsCollapsed: boolean;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faListAlt = faListAlt;
  faAddressBook = faAddressBook;
  faHeart = faHeart;
  faComment = faComment;
  faTachometerAlt = faTachometerAlt;
  faUniversity = faUniversity;
  faKey = faKey;
  faUserCircle = faUserCircle;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  constructor(
    public userService: UserService,
    public orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.isConsumer = this.userService.currentUser.userType == UserType.Consumer;
    this.isManager = this.userService.currentUser.userType === UserType.StoreManager;
    this.profilePanelIsCollapsed = false;
  }

  logOut(): void {
    this.userService.logOut().subscribe(() => {
      this.userService.logOutAction();
      this.orderService.sendLogOutEvent();
    })
  }

}
