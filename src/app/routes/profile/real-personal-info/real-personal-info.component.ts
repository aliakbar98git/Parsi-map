import {
  Component,
  EventEmitter,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ProfileService,
  RealPersonInfoGet,
  RealPersonInfoUpdate,
  PersonInfoUpdateResult,
} from '../shared';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Global, IRealUser, IResponse } from '@shared/.';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmMobileNumberModalComponent } from '../confirm-mobile-number-modal/confirm-mobile-number-modal.component';
import { UserService, UserType } from '../../user/shared';
import { ICustomer } from '../../cart/shared';

@Component({
  selector: 'app-real-personal-info',
  templateUrl: './real-personal-info.component.html',
  styleUrls: ['./real-personal-info.component.scss'],
})
export class RealPersonalInfoComponent implements OnInit {
  realPersonalInfoUpdateForm: FormGroup;
  isSubmitted: boolean;
  personalInfo: RealPersonInfoGet;
  global = Global;
  showLoading: boolean;
  isConsumer: boolean;
  editBySeller: boolean = false;
  customerSelected: ICustomer;
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private http: HttpClient,
    private modalService: NgbModal,
    private userService: UserService,
    @Optional() public activeModal: NgbActiveModal
  ) {
    this.isSubmitted = false;
    this.showLoading = true;
  }

  ngOnInit(): void {
    this.title.setTitle('اطلاعات شخصی');
    this.realPersonalInfoUpdateForm = this.formBuilder.group({
      realUserFields: [null],
    });
    this.isConsumer = this.editBySeller
      ? true
      : this.userService.currentUser.userType == UserType.Consumer;
    this.getRealPersonalInfo();
  }

  getRealPersonalInfo(): void {
    this.profileService
      .getRealPersonalInfo(this.editBySeller, this.customerSelected)
      .pipe(finalize(() => (this.showLoading = false)))
      .subscribe(
        (response) => {
          this.personalInfo = response.data;
          this.updateFormValues(response.data);
        },
        () => {
          this.activeModal.dismiss();
        }
      );
  }

  updateFormValues(personalInfo: RealPersonInfoGet): void {
    this.realPersonalInfoUpdateForm.setValue({
      realUserFields: {
        isForeign: personalInfo.isForeign,
        nationalCode: personalInfo.nationalCode,
        foreignerIdentityCode: personalInfo.foreignerIdentityCode,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        mobileNumber: personalInfo.mobileNumber,
        email: personalInfo.email,
      },
    });
  }

  onSubmit(): void {
    if (this.realPersonalInfoUpdateForm.invalid && !this.isConsumer) return;
    this.isSubmitted = true;
    delete this.personalInfo.confirmedEmail;
    delete this.personalInfo.confirmedMobile;
    this.updateRealPersonalInfo({
      ...this.personalInfo,
      ...this.realUserFields,
      nationalCode: !this.realUserFields.isForeign
        ? this.realUserFields.nationalCode
        : null,
      foreignerIdentityCode: this.realUserFields.isForeign
        ? this.realUserFields.foreignerIdentityCode
        : null,
      id: this.customerSelected?.customerId,
    })
      .pipe(finalize(() => (this.isSubmitted = false)))
      .subscribe((response) => {
        const responseData = response.data;
        if (this.editBySeller) {
          this.onSuccessSubmit.emit(responseData);
          this.activeModal.close();
          return;
        }
        if (responseData.needToConfirmMobile) {
          this.modalService
            .open(ConfirmMobileNumberModalComponent, {
              centered: true,
              size: 'lg',
            })
            .result.then(
              () => this.router.navigate(['/profile']),
              () => this.router.navigate(['/profile'])
            );
        } else {
          this.router.navigate(['/profile']);
        }
      });
  }

  updateRealPersonalInfo(
    personalInfo: RealPersonInfoUpdate
  ): Observable<IResponse<PersonInfoUpdateResult>> {
    const path = this.editBySeller
      ? 'Customer/UpdateRealCustomer'
      : 'User/UpdateRealUserProfile';
    return this.http.post<IResponse<PersonInfoUpdateResult>>(
      `${environment.apiUrl}/${path}`,
      personalInfo
    );
  }

  get realUserFields(): IRealUser {
    return this.realPersonalInfoUpdateForm.get('realUserFields').value;
  }
}
