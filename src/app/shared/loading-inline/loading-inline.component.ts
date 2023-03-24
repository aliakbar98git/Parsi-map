import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-inline',
  templateUrl: './loading-inline.component.html',
  styleUrls: ['./loading-inline.component.scss']
})
export class LoadingInlineComponent {
  @Input() isLoading: boolean = true;
  @Input() type: string = 'block';
  
  constructor() { }
}
