import { ValidatorFn, FormGroup, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export function checkNationalIdValidator(input: string): boolean {
  if (
    !/^\d{10}$/.test(input) ||
    input === '0000000000' ||
    input === '1111111111' ||
    input === '2222222222' ||
    input === '3333333333' ||
    input === '4444444444' ||
    input === '5555555555' ||
    input === '6666666666' ||
    input === '7777777777' ||
    input === '8888888888' ||
    input === '9999999999'
  ) {
    return false;
  }

  const check: number = parseInt(input[9], 10);
  let sum: number = 0;
  for (let i: number = 0; i < 9; 1 + i) {
    sum += parseInt(input[i], 10) * (10 - i);
  }
  sum %= 11;

  return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
}

/**
 * A conditional validator generator. Assigns a validator to the form control if the predicate function returns true on the moment of validation
 * @example
 * Here if the myCheckbox is set to true, the myEmailField will be required and also the text will have to have the word 'mason' in the end.
 * If it doesn't satisfy these requirements, the errors will placed to the dedicated `illuminatiError` namespace.
 * Also the myEmailField will always have `maxLength`, `minLength` and `pattern` validators.
 * ngOnInit() {
 *   this.myForm = this.fb.group({
 *    myCheckbox: [''],
 *    myEmailField: ['', [
 *       Validators.maxLength(250),
 *       Validators.minLength(5),
 *       Validators.pattern(/.+@.+\..+/),
 *       conditionalValidator(() => this.myForm.get('myCheckbox').value,
 *                            Validators.compose([
 *                            Validators.required,
 *                            Validators.pattern(/.*mason/)
 *         ]),
 *        'illuminatiError')
 *        ]]
 *     })
 * }
 * @param predicate
 * @param validator
 * @param errorNamespace optional argument that creates own namespace for the validation error
 */
export function conditionalValidator(
  predicate: BooleanFn,
  validator: ValidatorFn,
  errorNamespace?: string
): ValidatorFn {
  return (formControl: FormGroup) => {
    if (!formControl.parent) {
      return null;
    }
    let error = null;
    if (predicate()) {
      error = validator(formControl);
    }
    if (errorNamespace && error) {
      const customError = {};
      customError[errorNamespace] = error;
      error = customError;
    }
    return error;
  };
}

export function mustMatchValidator(
  firstControlName: string,
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const firstControl = control.get(firstControlName);
    const matchingControl = control.get(matchingControlName);

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }

    // set error on matchingControl if validation fails
    if (firstControl.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true }
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!(/^(IR)*[0-9]{24}$/.test(control.value))) {
      return null;
    }
    const controlValue = control.value.length === 24 ? `IR${control.value}` : control.value;
    let newStr = controlValue.substr(4);
    const d1 = controlValue.charCodeAt(0) - 65 + 10;
    const d2 = controlValue.charCodeAt(1) - 65 + 10;
    newStr += d1.toString() + d2.toString() + controlValue.substr(2, 2);
    return iso7064Mod97_10(newStr) !== 1 ? { 'isbn': { value: control.value } } : null;
  };
}

function iso7064Mod97_10(iban) {
  let remainder = iban,
    block;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
  }

  return parseInt(remainder, 10) % 97;
}

export function nationalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!/^\d{10}$/.test(control.value)) return null;
    if (/^(\d)\1+$/.test(control.value)) return { 'nationalCode': { value: control.value } };

    const check = parseInt(control.value[9]);
    let sum = 0, i;
    for (i = 0; i < 9; ++i) {
      sum += parseInt(control.value[i]) * (10 - i);
    }
    sum %= 11;

    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11) ? null : { 'nationalCode': { value: control.value } };
  };
}

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || !/^.{3,}$/.test(control.value) || /^[a-zA-Z][0-9a-zA-Z_.-]{2,}$/.test(control.value)) return null
    else return { 'username': { value: control.value } }
  }
}

export function mobileOrUsernameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let usernameValidatorFn: ValidatorFn = usernameValidator();
    if (usernameValidatorFn(control) === null || /^\d{11}$/.test(control.value)) return null
    else return { 'mobileOrUsername': { value: control.value } }
  }
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || !/^.{6,}$/.test(control.value) || /^[^آاب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی]{6,}$/.test(control.value)) return null
    else return { 'password': { value: control.value } }
  }
}

export function economicCodeValidator(control: AbstractControl) {
  if (control.value.length > 0 && (!control.value.startsWith('4') || (control.value.length > 0 && control.value.length < 12))) {
    return { economicCodeValid: true };
  }
  return null;
}

export function nationalIdValidator(control: AbstractControl) {
  const code = control.value;
  var L = code.length;

  if (L < 11 || parseInt(code, 10) == 0) return false;

  if (parseInt(code.substr(3, 6), 10) == 0) return false;
  var c = parseInt(code.substr(10, 1), 10);
  var d = parseInt(code.substr(9, 1), 10) + 2;
  var z = new Array(29, 27, 23, 19, 17);
  var s = 0;
  for (var i = 0; i < 10; i++)
    s += (d + parseInt(code.substr(i, 1), 10)) * z[i % 5];
  s = s % 11; if (s == 10) s = 0

  if (c !== s) {
    return { nationalIdValid: true };
  }
  return null;
}

interface BooleanFn {
  (): boolean;
}

export const identityMatchingPrecentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const discountPercent = +control.get('specialDiscountPercent').value;
  const discountDetails = control.get('specialDiscountDetails') as FormArray;
  let sumDiscountDetailsPercents: number = 0;
  discountDetails.controls.forEach((group) => {
    sumDiscountDetailsPercents += +group.get('discountPercent').value;
  });
  return discountPercent.toFixed(2) !== sumDiscountDetailsPercents.toFixed(2) ? { identityMatchingPrecent: true } : null;
};

export function atLeastOneControlIsTrueValidator(controlNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return controlNames.some(name => control.get(name).value === true) ? null : { atLeastOneControl: true };
  }
}
