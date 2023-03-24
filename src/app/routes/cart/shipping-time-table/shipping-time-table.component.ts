import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShippingPeriod } from '../../profile/shared';
import { IShiftTypePlaning, ITimeTable } from '../shared';

@Component({
  selector: 'app-shipping-time-table',
  templateUrl: './shipping-time-table.component.html',
  styleUrls: ['./shipping-time-table.component.scss']
})
export class ShippingTimeTableComponent {
  @Input() type: 'date' | 'dateTime';
  @Input() prefix: string;
  @Input() selectedItem: any;
  @Input() shiftTypePlaning: IShiftTypePlaning[];
  shippingPeriod: typeof ShippingPeriod = ShippingPeriod;

  @Output() setDate: EventEmitter<ITimeTable> = new EventEmitter();

  constructor() { }

  selectDate(deliveryDate: string, shippingPeriod: number) {
    this.setDate.emit({
      deliveryDate,
      shippingPeriod
    });
  }
}
