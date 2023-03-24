import { Component } from '@angular/core';
import { faCaretDown, faCaretUp, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserService, UserType } from '../../routes/user/shared';
import { OrderService } from 'src/app/routes/product';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { UserSelectRoleComponent } from '@shared/user-select-role/user-select-role.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideUpDown', [
      state('up', style({
        display: 'block',
        height: '0',
        opacity: '0'
      })),
      state('down', style({
        display: 'block',
        opacity: '1'
      })),
      transition('up => down', animate('.2s ease-in')),
      transition('down => up', animate('.3s ease-out'))
    ])

  ]
})

export class HeaderComponent {
  faCaret = faCaretDown;
  faUserCircle = faUserCircle;
  faSignOutAlt = faSignOutAlt
  slideState: 'up' | 'down' = 'up';
  isCheckout: boolean = false;
  cartRoutPrefix: string = '/cart/';
  selectRoleModalRef: any;

  constructor(
    public userService: UserService,
    public orderService: OrderService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        if (evt.url.startsWith(this.cartRoutPrefix) && evt.url.length > this.cartRoutPrefix.length)
          this.isCheckout = true;
        else
          this.isCheckout = false;
      }
    });
  }

  public get userType(): typeof UserType {
    return UserType;
  }

  logOut(): void {
    this.userService.logOut().subscribe(response => {
      this.userService.logOutAction();
      this.orderService.sendLogOutEvent();
      this.userService.logInOutSubject.next(true);
    })
  }

  onDropDownChange(isOpen) {
    if (isOpen) {
      this.faCaret = faCaretUp;
      this.slideState = 'down';
    } else {
      this.faCaret = faCaretDown;
      this.slideState = 'up';
    }
  }

  changeRole() {
    this.userService.getUserRoles().subscribe(response => {
      this.selectRoleModalRef = this.modalService.open(UserSelectRoleComponent, { centered: true, backdrop: 'static' });
      this.selectRoleModalRef.componentInstance.onSuccessSubmit.subscribe(() => this.onSelectUserSuccessSubmit());
      this.selectRoleModalRef.componentInstance.users = response.data;
    })
  }

  onSelectUserSuccessSubmit() {
    window.location.reload();
  }
}
