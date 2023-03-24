import { Component, OnInit, OnDestroy, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  Validator,
  FormGroup,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { conditionalValidator, nationalCodeValidator } from 'src/app/helpers';
import { UserService, UserType } from 'src/app/routes/user/shared';
import { Global, IRealUser } from '..';

@Component({
  selector: 'app-real-user',
  templateUrl: './real-user.component.html',
  styleUrls: ['./real-user.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RealUserComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RealUserComponent),
      multi: true
    }
  ]
})
export class RealUserComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  @Input() editable: boolean = true;
  realUserForm: FormGroup;
  subscription: Subscription = new Subscription();
  global = Global;
  showIsForeign: boolean;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.showIsForeign = true;
  }

  ngOnInit(): void {
    this.realUserForm = this.formBuilder.group({
      isForeign: [false],
      nationalCode: ['', [
        conditionalValidator(() => !this.isForeign.value, Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          nationalCodeValidator()
        ]))]
      ],
      foreignerIdentityCode: ['', [
        conditionalValidator(() => this.isForeign.value, Validators.compose([
          Validators.required,
          Validators.maxLength(13),
        ]))]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)]],
      email: ['', Validators.email]
    });

    this.subscription.add(this.isForeign.valueChanges.subscribe(() => {
      this.nationalCode.updateValueAndValidity();
      this.foreignerIdentityCode.updateValueAndValidity();
    }));
    this.subscription.add(this.realUserForm.valueChanges.subscribe(() => {
      this.onChange(this.realUserForm.getRawValue());
      this.onTouched();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get isForeign(): AbstractControl {
    return this.realUserForm.get("isForeign");
  }

  get nationalCode(): AbstractControl {
    return this.realUserForm.get("nationalCode");
  }

  get foreignerIdentityCode(): AbstractControl {
    return this.realUserForm.get("foreignerIdentityCode");
  }

  get mobileNumber(): AbstractControl {
    return this.realUserForm.get("mobileNumber");
  }

  get firstName(): AbstractControl {
    return this.realUserForm.get("firstName");
  }

  get lastName(): AbstractControl {
    return this.realUserForm.get("lastName");
  }

  get email(): AbstractControl {
    return this.realUserForm.get("email");
  }

  writeValue(value: IRealUser): void {
    if (value) {
      this.realUserForm.patchValue(value);
      this.realUserForm.markAllAsTouched();
      if (!value.isForeign) this.showIsForeign = false;
      if (this.editable) return;
      this.isForeign.disable();
      if (this.nationalCode.valid) this.nationalCode.disable();
      this.foreignerIdentityCode.disable();
      if (this.userService.currentUser?.userType == UserType.Seller || this.userService.currentUser?.userType == UserType.StoreManager) {
        this.mobileNumber.disable();
        this.firstName.disable();
        this.lastName.disable();
        this.email.disable();
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.realUserForm.disable() : this.realUserForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.realUserForm.valid ? null : { realUserForm: { valid: false, message: "realUserForm's fields are invalid" } };
  }

  showValidations() {
    this.realUserForm.markAllAsTouched();
  }
}
