import { Component } from '@angular/core';

import { LoadingService } from '../_services/loading.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class Loading {
  constructor(public loadingService: LoadingService) { }
}
