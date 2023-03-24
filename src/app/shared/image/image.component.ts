import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { ImageType } from '@shared/_enums/imageType.enum';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})

export class ImageComponent implements OnInit {
  @Input() size: string;
  @Input() cssClass: string;
  @Input() documentInfoId: string;
  @Input() imageType: ImageType;
  @Input() alt: string;
  @Input() width?: string;
  @Input() height?: string;

  imageUrl: string;

  constructor() {
  }

  ngOnInit(): void {
    this.imageUrl = `${environment.cdnUrl}/${this.size}/${this.documentInfoId}.${ImageType[this.imageType]}`;
  }
}
