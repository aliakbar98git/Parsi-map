import { Directive, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appConvertNumbersToEnglish]'
})
export class ConvertNumbersToEnglishDirective {
  private _onChange: (value) => {};
  constructor(@Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor.registerOnChange = (fn) => {
        this._onChange = fn;
      };
    } 
  }

  @HostListener('input', ['$event.target']) onInput(element: HTMLInputElement) {
    let newVal = element.value.replace(/[۰-۹]/g, number => '۰۱۲۳۴۵۶۷۸۹'.indexOf(number).toString());
    element.value = newVal;
    if (typeof this._onChange === 'function') this._onChange(newVal);
  }
}
