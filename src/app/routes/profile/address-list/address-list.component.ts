import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faPlus, faMapSigns, faTimes, faCheckSquare, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';
import { ProfileService, AddressGet, AddressRemove } from '../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AddressDetailComponent } from '../address-detail/address-detail.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  addressList: AddressGet[];
  addressDetailModalRef;
  removeAddressModalRef;
  faPlus = faPlus;
  faMapSigns = faMapSigns;
  faTimes = faTimes;
  faCheckSquare = faCheckSquare;
  faObjectUngroup = faObjectUngroup;
  showLoading: boolean;

  constructor(
    private title: Title,
    private profileService: ProfileService,
    private modalService: NgbModal
  ) {
    this.showLoading = true;
   }

  ngOnInit(): void {

    this.title.setTitle('لیست آدرس');
    this.getAddressList();
  }

  getAddressList(): void {

    this.profileService.getAddressList()
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(
        response => {
          this.addressList = response.data;
        }
      );
  }

  openAddressDetailModal(item: AddressGet = null): void {
    this.addressDetailModalRef = this.modalService.open(AddressDetailComponent, { centered: true, size: 'lg' });
    if (item !== null) {
      this.addressDetailModalRef.componentInstance.address = item;
    }
    this.addressDetailModalRef.componentInstance.onSuccessSubmit.subscribe(() => this.onSuccessSubmit());
  }

  onSuccessSubmit(): void {
    this.getAddressList();
    this.addressDetailModalRef.close();
  }

  openRemoveAddressModal(item: AddressGet): void {
    this.removeAddressModalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'sm' });
    this.removeAddressModalRef.componentInstance.title = 'حذف آدرس';
    this.removeAddressModalRef.componentInstance.data = {
      personAddressInfoId: item.personAddressInfoId
    };
    this.removeAddressModalRef.componentInstance.onConfirmationButton.subscribe(($event) => this.removeAddress($event));
  }

  removeAddress(item: AddressRemove): void {
    this.profileService.removeAddress(item)
      .pipe(
        finalize(() => this.removeAddressModalRef.close())
      )
      .subscribe(
        () => {
          this.addressList = this.addressList.filter(filterItem => filterItem.personAddressInfoId !== item.personAddressInfoId);
        }
      );
  }
}
