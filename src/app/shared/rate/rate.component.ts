import { Component, OnInit, Input } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Align } from '../_enums/align.enum';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  @Input() score: number;
  @Input() options: { textAlign: Align } = { textAlign: Align.Center };
  faStar = faStar;
  constructor() { }

  ngOnInit(): void {
  }

}
