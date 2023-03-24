import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Global, IResponse, SharedService } from '@shared/.';
import { faInfoCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs/operators';
import { RealUserRegistration, UserService } from '../shared';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { CartService, ICustomer } from '../../cart/shared';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-mobile-number',
  templateUrl: './confirm-mobile-number.component.html',
  styleUrls: ['./confirm-mobile-number.component.scss'],
})
export class ConfirmMobileNumberComponent implements OnInit {
  confirmMobileNumberForm: FormGroup;
  isSubmitted: boolean;
  global = Global;
  faInfoCircle = faInfoCircle;
  userId: string;
  confirmationCode: string;
  faRedo = faRedo;
  isShowCode = false;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient, 
    private cartService: CartService, 
    public activeModal: NgbActiveModal
  ) {
    this.userService.UserParentOfCheckCustomer.subscribe((res) => {
      this.userId = res;
    });
  }

  ngOnInit(): void {
    this.title.setTitle('کد فعالسازی');
    this.confirmMobileNumberForm = this.formBuilder.group({
      code: ['', Validators.required],
    });
   
  }

  onSubmit(): void {
    if (this.confirmMobileNumberForm.invalid) return;
    this.isSubmitted = true;
    this.sharedService
      .confirmMobileNumber({ code: this.code.value, userId: this.userId })
      .pipe(
        finalize(() => {
          this.isSubmitted = false;
        })
      )
      .subscribe((res) => {
        const redirectToShipping =
          this.activeRoute.snapshot.queryParams.redirectToShipping;
        const url = this.router.url.split('/');
        if (
          (typeof redirectToShipping != 'undefined' &&
            redirectToShipping == 'true') ||
          url[url.length - 1] == 'check-customer'
        ) {
          this.router.navigate(['/cart/shipping']);
        } else {
          this.router.navigate(['/profile']);
        }
        this.activeModal.dismiss();
      });
  }

  get code(): AbstractControl {
    return this.confirmMobileNumberForm.get('code');
  }

  registerRealUserBySeller(
    data: RealUserRegistration
  ): Observable<IResponse<ICustomer>> {
    return this.http.post<IResponse<ICustomer>>(
      `${environment.apiUrl}/user/RegisterRealUserBySeller`,
      data
    );
  }
  showActivationCode() {
    debugger;
    this.isShowCode = true;
  }
}
