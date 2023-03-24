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
import { PasswordConfirmation, Global } from '..';
import { mustMatchValidator, passwordValidator } from 'src/app/helpers';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.component.html',
  styleUrls: ['./password-confirmation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordConfirmationComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordConfirmationComponent),
      multi: true
    }
  ]
})
export class PasswordConfirmationComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  passwordConfirmationForm: FormGroup;
  formSubscription: Subscription;
  faInfoCircle = faInfoCircle;
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  global = Global;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.passwordConfirmationForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        passwordValidator()]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: mustMatchValidator('password', 'confirmPassword'),
    });
    this.formSubscription = this.passwordConfirmationForm.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  get password(): AbstractControl {
    return this.passwordConfirmationForm.get("password");
  }

  get confirmPassword(): AbstractControl {
    return this.passwordConfirmationForm.get("confirmPassword");
  }

  writeValue(value: PasswordConfirmation): void {
    if (value) {
      this.passwordConfirmationForm.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.passwordConfirmationForm.disable() : this.passwordConfirmationForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.passwordConfirmationForm.valid ? null : { passwordConfirmationForm: { valid: false, message: "passwordConfirmationForm's fields are invalid" } };
  }

  showValidations() {
    this.passwordConfirmationForm.markAllAsTouched();
  }
}
