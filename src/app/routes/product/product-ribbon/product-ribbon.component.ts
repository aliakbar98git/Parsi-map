import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-ribbon',
  templateUrl: './product-ribbon.component.html',
  styleUrls: ['./product-ribbon.component.scss']
})
export class ProductRibbonComponent implements OnInit {
  @Input() list: string[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
