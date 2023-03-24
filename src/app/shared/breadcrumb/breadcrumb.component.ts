import { Component, OnInit, Input } from '@angular/core';
import { IBreadcrumb } from 'src/app/routes/product';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumbs: IBreadcrumb[];
  @Input() currentTitle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
