import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '@environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Global, IResponse, SharedService } from '@shared/.';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../user/shared';
import { AddressType, IAddress } from '../shared';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.component.html',
  styleUrls: ['./address-detail.component.scss'],
})
export class AddressDetailComponent implements OnInit {
  @Optional() @Input() address: IAddress;
  @Optional() @Input() personId: number;
  @Output() onSuccessSubmit: EventEmitter<any> = new EventEmitter();
  addressDetailForm: FormGroup;
  isSubmitted: boolean;
  modalTitle: string;
  global = Global;
  locationLonLat: number[];
  sendAdressIdToMap: Subject<any> = new Subject();
  elevatordata = [
    { id: 0, name: 'ندارد', value: false },
    { id: 1, name: 'دارد', value: true },
  ];
  lat;
  lng;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal,
    public sharedService: SharedService,
    public userService: UserService
  ) {
    this.isSubmitted = false;
  }

  ngOnInit(): void {
    if (typeof this.address === 'undefined') {
      this.modalTitle = 'افزودن آدرس';
      this.address = {
        addressType: AddressType.Shipping,
        cityId: null,
        parishId: null,
        contactNumber: '',
        postalCode: null,
        address: '',
        additionalAddressInfo: '',
        isDefault: false,
        Longitude: null,
        Latitude: null,
        houseNumber: null,
        hasElevator: null,
        floorNumber: null,
        needCheckOfficeAddress: false,
        isLegal: false,
        isRegister: false,
        unitNumber: '',
        userRole: '',
      };
      if (this.personId != undefined) this.address.personId = this.personId;
    } else {
      this.modalTitle = 'ویرایش آدرس';
    }
    this.addressDetailForm = this.formBuilder.group({
      cityId: [this.address.cityId, Validators.required],
      parishId: [this.address.parishId],
      contactNumber: [this.address.contactNumber, [Validators.required]],
      postalCode: [this.address.postalCode],
      address: [this.address.address, [Validators.required]],
      isDefault: [this.address.isDefault],
      Longitude: [this.address.Longitude],
      Latitude: [this.address.Latitude],
      userRole: [this.address.userRole],
      additionalAddressInfo: [this.address.additionalAddressInfo],
      houseNumber: [this.address.houseNumber, [Validators.required]],
      floorNumber: [this.address.floorNumber, [Validators.required]],
      hasElevator: [this.address.hasElevator, [Validators.required]],
      unitNumber: [this.address.unitNumber, [Validators.required]],
    });
    this.sharedService.additionalAddressInfo.subscribe((res) => {
      this.addressDetailForm.patchValue(res);
    });
  }

  changeValue() {
    this.sharedService.getAddrestIdToMap.subscribe((res) => {
      let longToNubmer = parseFloat(res.data?.longitude).toFixed(8);
      let latToNubmer = parseFloat(res.data?.latitude).toFixed(8);
      this.Longitude.patchValue(+longToNubmer);
      this.Latitude.patchValue(+latToNubmer);

    });
    let cityId = this.cityId.value;
    let parishId = this.parishId.value;
    let addressSum = cityId + ',' + parishId;
    let payload = {
      neighborhoodIDs: addressSum,
    };

    this.sharedService.getNeighborhoodLocation(payload).subscribe((res) => {
      this.sharedService.getAddrestIdToMap.next(res);
    });
  }

  onSubmit(): void {
    if (this.addressDetailForm.invalid) {
      return;
    } else {
      this.isSubmitted = true;
      this.addOrUpdateAddress({
        ...this.address,
        ...this.addressDetailForm.value,
      });
    }
  }

  addOrUpdateAddress(item: IAddress): void {

    this.http.post<IResponse>(`${environment.apiUrl}/PersonAddressInfo/CreatePersonAddressInfo`, item)
      .pipe(finalize(() => (this.isSubmitted = false)))
      .subscribe((response) => {
        this.onSuccessSubmit.emit(response.data);
      });
  }

  get cityId(): AbstractControl {
    return this.addressDetailForm.get('cityId');
  }
  get parishId(): AbstractControl {
    return this.addressDetailForm.get('parishId');
  }

  get contactNumber(): AbstractControl {
    return this.addressDetailForm.get('contactNumber');
  }

  get postalCode(): AbstractControl {
    return this.addressDetailForm.get('postalCode');
  }

  get addressContent(): AbstractControl {
    return this.addressDetailForm.get('address');
  }

  get isDefault(): AbstractControl {
    return this.addressDetailForm.get('isDefault');
  }
  get Longitude(): AbstractControl {
    return this.addressDetailForm.get('Longitude');
  }
  get Latitude(): AbstractControl {
    return this.addressDetailForm.get('Latitude');
  }
  get houseNumber(): AbstractControl {
    return this.addressDetailForm.get('houseNumber');
  }
 
  get floorNumber(): AbstractControl {
    return this.addressDetailForm.get('floorNumber');
  }

  get hasElevator(): AbstractControl {
    return this.addressDetailForm.get('hasElevator');
  }
  get unitNumber(): AbstractControl {
    return this.addressDetailForm.get('unitNumber');
  }
  get additionalAddressInfo(): AbstractControl {
    return this.addressDetailForm.get('additionalAddressInfo');
  }
}
