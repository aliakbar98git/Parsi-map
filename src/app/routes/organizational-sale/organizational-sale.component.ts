import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-organizational-sale',
  templateUrl: './organizational-sale.component.html',
  styleUrls: ['./organizational-sale.component.scss']
})
export class OrganizationalSaleComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('فروش سازمانی');
  }

}
