import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faPencilAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { PersonInfo, ProfileService } from '../shared';
import { PersonType, UserService, UserType } from '../../user/shared';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmMobileNumberModalComponent } from '../confirm-mobile-number-modal/confirm-mobile-number-modal.component';
import { IResponse, SharedService } from '@shared/.';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  personalInfo: PersonInfo;
  faPencilAlt = faPencilAlt;
  faInfoCircle = faInfoCircle;
  showLoading: boolean;
  resendEmailSecurityCodeLoading: boolean;
  resendSmsSecurityCodeLoading: boolean;

  constructor(
    private profileService: ProfileService,
    private title: Title,
    private userService: UserService,
    private modalService: NgbModal,
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.showLoading = true;
  }

  ngOnInit(): void {
    this.title.setTitle('پروفایل');
    if ((this.userService.currentUser.userType === UserType.Consumer && this.userService.currentUser.personType === PersonType.RealPerson) ||
        this.userService.currentUser.userType === UserType.Seller ||
        this.userService.currentUser.userType === UserType.StoreManager) {
          this.getRealPersonalInfo();
    } else {
      this.getLegalPersonalInfo();
    }
  }

  getRealPersonalInfo(): void {
    this.profileService.getRealPersonalInfo()
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(response => {
        const responseData = response.data;
        this.personalInfo = {
          fullName: `${responseData.firstName} ${responseData.lastName}`,
          mobileNumber: responseData.mobileNumber,
          confirmedMobile: responseData.confirmedMobile,
          email: responseData.email,
          confirmedEmail: responseData.confirmedEmail
        }
      });
  }

  getLegalPersonalInfo(): void {
    this.profileService.getLegalPersonalInfo()
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(response => {
        const responseData = response.data;
        this.personalInfo = {
          fullName: responseData.title,
          mobileNumber: responseData.mobileNumber,
          confirmedMobile: responseData.confirmedMobile,
          email: responseData.email,
          confirmedEmail: responseData.confirmedEmail
        }
      });
  }

  resendEmailSecurityCode(): void {
    this.resendEmailSecurityCodeLoading = true;
    this.http.post<IResponse<any>>(`${environment.apiUrl}/user/resendemailsecuritycode`, {})
      .pipe(finalize(() => this.resendEmailSecurityCodeLoading = false))
      .subscribe();
  }

  resendSmsSecurityCode(): void {
    this.resendSmsSecurityCodeLoading = true;
    this.sharedService.resendSmsSecurityCode()
      .pipe(finalize(() => this.resendSmsSecurityCodeLoading = false))
      .subscribe(() => {
        this.modalService.open(ConfirmMobileNumberModalComponent, { centered: true, size: 'lg' })
          .result.then(() => this.personalInfo.confirmedMobile = true);
      });
  }
}
