import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ToastService } from '@shared/toast/toast.service';

@Directive({
  selector: '[appMaskError]'
})
export class MaskErrorDirective {
  @Input('appMaskError') message;
  private oldValue;
  constructor(
    private toastService: ToastService,
    private elementRef: ElementRef
  ) {
    this.oldValue = elementRef.nativeElement.value;
   }

  @HostListener('input') onInput() {
    if (this.oldValue === this.elementRef.nativeElement.value) this.toastService.showWarning(this.message)
    else this.oldValue = this.elementRef.nativeElement.value;
  }

  @HostListener('paste', ['$event']) onPaste(element) {
    if (this.oldValue === element.clipboardData.getData('text')) element.preventDefault();
    else this.oldValue = '';
  }
}
