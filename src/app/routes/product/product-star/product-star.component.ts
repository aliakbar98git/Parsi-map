import { Component, OnInit, Input } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-star',
  templateUrl: './product-star.component.html',
  styleUrls: ['./product-star.component.scss']
})
export class ProductStarComponent implements OnInit {
  @Input() score: number;
  faStar = faStar;

  constructor() { }

  ngOnInit(): void {
  }

}
