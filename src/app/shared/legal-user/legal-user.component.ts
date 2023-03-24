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
import { conditionalValidator, economicCodeValidator, nationalCodeValidator, nationalIdValidator } from 'src/app/helpers';
import { DocumentType } from '@shared/_enums/documentType.enum';
import { Global, ILegalUser } from '..';

@Component({
  selector: 'app-legal-user',
  templateUrl: './legal-user.component.html',
  styleUrls: ['./legal-user.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LegalUserComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LegalUserComponent),
      multi: true
    }
  ]
})
export class LegalUserComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  @Input() editable: boolean = true;
  legalUserForm: FormGroup;
  subscription: Subscription = new Subscription();
  global = Global;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.legalUserForm = this.formBuilder.group({
      nationalId: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        nationalIdValidator
      ]],
      title: ['', Validators.required],
      registrationCode: ['', Validators.required],
      economicCode: ['', [economicCodeValidator]],
      contactNumber: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      cityId: [null, Validators.required],
      parishId: [null],
      address: ['', Validators.required],
      email: ['', Validators.email],
      representativePersonIsForeign: [false],
      representativePersonNationalCode: ['', [
        conditionalValidator(() => !this.representativePersonIsForeign.value, Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          nationalCodeValidator()
        ]))]],
      representativePersonForeignerIdentityCode: ['', [
        conditionalValidator(() => this.representativePersonIsForeign.value, Validators.compose([
          Validators.required,
          Validators.maxLength(13),
        ]))]],
      mobileNumber: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      representativePersonFirstName: ['', Validators.required],
      representativePersonLastName: ['', Validators.required],
      vatCertificateDocumentInfoId: ['', Validators.required],
      representativePersonIntroductionDocumentInfoId: [null],
    });

    this.subscription.add(this.representativePersonIsForeign.valueChanges.subscribe(() => {
      this.representativePersonNationalCode.updateValueAndValidity();
      this.representativePersonForeignerIdentityCode.updateValueAndValidity();
    }));
    this.subscription.add(this.legalUserForm.valueChanges.subscribe(() => {
      this.onChange(this.legalUserForm.getRawValue());
      this.onTouched();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get getDocumentType(): typeof DocumentType {
    return DocumentType;
  }

  get nationalId(): AbstractControl {
    return this.legalUserForm.get("nationalId");
  }

  get legalPersonTitle(): AbstractControl {
    return this.legalUserForm.get("title");
  }

  get registrationCode(): AbstractControl {
    return this.legalUserForm.get("registrationCode");
  }

  get economicCode(): AbstractControl {
    return this.legalUserForm.get("economicCode");
  }

  get contactNumber(): AbstractControl {
    return this.legalUserForm.get("contactNumber");
  }

  get postalCode(): AbstractControl {
    return this.legalUserForm.get("postalCode");
  }

  get cityId(): AbstractControl {
    return this.legalUserForm.get("cityId");
  }

  get parishId(): AbstractControl {
    return this.legalUserForm.get("parishId");
  }

  get address(): AbstractControl {
    return this.legalUserForm.get("address");
  }

  get email(): AbstractControl {
    return this.legalUserForm.get("email");
  }

  get representativePersonIsForeign(): AbstractControl {
    return this.legalUserForm.get("representativePersonIsForeign");
  }

  get representativePersonNationalCode(): AbstractControl {
    return this.legalUserForm.get("representativePersonNationalCode");
  }

  get representativePersonForeignerIdentityCode(): AbstractControl {
    return this.legalUserForm.get("representativePersonForeignerIdentityCode");
  }

  get mobileNumber(): AbstractControl {
    return this.legalUserForm.get("mobileNumber");
  }

  get representativePersonFirstName(): AbstractControl {
    return this.legalUserForm.get("representativePersonFirstName");
  }

  get representativePersonLastName(): AbstractControl {
    return this.legalUserForm.get("representativePersonLastName");
  }

  get vatCertificateDocumentInfoId(): AbstractControl {
    return this.legalUserForm.get("vatCertificateDocumentInfoId");
  }

  get representativePersonIntroductionDocumentInfoId(): AbstractControl {
    return this.legalUserForm.get("representativePersonIntroductionDocumentInfoId");
  }

  writeValue(value: (ILegalUser & { canRegisterInformation }) | null): void {
    if (value) {
      if (!value.canRegisterInformation) {
        this.nationalId.disable();
        this.legalPersonTitle.disable();
        this.registrationCode.disable();
        this.economicCode.disable();
      }
      delete value.canRegisterInformation;
      this.legalUserForm.patchValue(value);
      this.legalUserForm.markAllAsTouched();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.legalUserForm.disable() : this.legalUserForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.legalUserForm.valid ? null : { legalUserForm: { valid: false, message: "legalUserForm's fields are invalid" } };
  }

  showValidations() {
    this.legalUserForm.markAllAsTouched();
  }
}
