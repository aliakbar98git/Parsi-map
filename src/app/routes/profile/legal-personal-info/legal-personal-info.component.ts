import { Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProfileService, LegalPersonInfoGet, LegalPersonInfoUpdate, PersonInfoUpdateResult } from '../shared';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global, ILegalUser, IResponse } from '@shared/.';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { ConfirmMobileNumberModalComponent } from '../confirm-mobile-number-modal/confirm-mobile-number-modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@shared/toast/toast.service';
import { ICustomer } from '../../cart/shared';

@Component({
  selector: 'app-legal-personal-info',
  templateUrl: './legal-personal-info.component.html',
  styleUrls: ['./legal-personal-info.component.scss']
})
export class LegalPersonalInfoComponent implements OnInit {
  legalPersonalInfoUpdateForm: FormGroup;
  isSubmitted: boolean;
  personalInfo: LegalPersonInfoGet;
  global = Global;
  showLoading: boolean;
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
    private toastService: ToastService,
    @Optional() public activeModal: NgbActiveModal
  ) {
    this.isSubmitted = false;
    this.showLoading = true;
  }

  ngOnInit(): void {
    this.title.setTitle('اطلاعات شخصی');
    this.legalPersonalInfoUpdateForm = this.formBuilder.group({
      legalUserFields: [null]
    });
    this.getLegalPersonalInfo();
  }

  getLegalPersonalInfo(): void {
    this.profileService.getLegalPersonalInfo(this.editBySeller, this.customerSelected)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(response => {
        this.personalInfo = response.data;
        this.updateFormValues(response.data);
      }, () => {
        this.activeModal.dismiss();
      });
  }

  updateFormValues(personalInfo: LegalPersonInfoGet): void {
    this.legalPersonalInfoUpdateForm.setValue({
      legalUserFields: {
        title: personalInfo.title,
        nationalId: personalInfo.nationalId,
        registrationCode: personalInfo.registrationCode,
        economicCode: personalInfo.economicCode,
        mobileNumber: personalInfo.mobileNumber,
        email: personalInfo.email,
        postalCode: personalInfo.postalCode,
        cityId: personalInfo.cityId,
        parishId: personalInfo.parishId,
        address: personalInfo.address,
        contactNumber: personalInfo.contactNumber,
        representativePersonIsForeign: personalInfo.representativePersonIsForeign,
        representativePersonNationalCode: personalInfo.representativePersonNationalCode,
        representativePersonForeignerIdentityCode: personalInfo.representativePersonForeignerIdentityCode,
        representativePersonFirstName: personalInfo.representativePersonFirstName,
        representativePersonLastName: personalInfo.representativePersonLastName,
        canRegisterInformation: personalInfo.canRegisterInformation,
        representativePersonIntroductionDocumentInfoId: personalInfo.representativePersonIntroductionDocumentInfoId,
        vatCertificateDocumentInfoId: personalInfo.vatCertificateDocumentInfoId
      }
    });
  }

  onSubmit(): void {
    if (this.legalPersonalInfoUpdateForm.invalid) return;
    this.isSubmitted = true;
    delete this.personalInfo.confirmedEmail;
    delete this.personalInfo.confirmedMobile;
    this.updateRealPersonalInfo({
      ...this.personalInfo,
      ...this.legalUserFields,
      representativePersonNationalCode: !this.legalUserFields.representativePersonIsForeign ? this.legalUserFields.representativePersonNationalCode : null,
      representativePersonForeignerIdentityCode: this.legalUserFields.representativePersonIsForeign ? this.legalUserFields.representativePersonForeignerIdentityCode : null,
      id: this.customerSelected?.customerId
    })
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        (response) => {
          const responseData = response.data;
          if (this.editBySeller) {
            this.onSuccessSubmit.emit(responseData);
            this.activeModal.close();
            return;
          }
          if (responseData.needToConfirmMobile) {
            this.modalService.open(ConfirmMobileNumberModalComponent, { centered: true, size: 'lg' })
              .result.then(() => this.router.navigate(['/profile']), () => this.router.navigate(['/profile']));
          } else {
            this.router.navigate(['/profile']);
          }
        }
      );
  }

  updateRealPersonalInfo(personalInfo: LegalPersonInfoUpdate): Observable<IResponse<PersonInfoUpdateResult>> {
    const path = this.editBySeller ? 'Customer/UpdateLegalCustomer' : 'User/UpdateLegalPerson';
    return this.http.post<IResponse<PersonInfoUpdateResult>>(`${environment.apiUrl}/${path}`, personalInfo);
  }

  get legalUserFields(): ILegalUser {
    return this.legalPersonalInfoUpdateForm.get('legalUserFields').value;
  }
}
