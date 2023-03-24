import { Component, Input } from '@angular/core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-search-accordion',
  templateUrl: './product-search-accordion.component.html',
  styleUrls: ['./product-search-accordion.component.scss']
})
export class ProductSearchAccordionComponent {
  @Input() title: number;
  @Input() opened: boolean = false;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  constructor() { }

  toggleOpen(): void {
    this.opened = !this.opened
  }
}
