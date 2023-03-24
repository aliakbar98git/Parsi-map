import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subscription, timer } from 'rxjs';
import { IProductAttachment } from './../shared/product.model';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() images: IProductAttachment[];
  activeImageIndex: number = 0;
  thumbnailPosition: {};
  private thumbnailHeight: number = 120;
  private thumbnailWidth: number = 0;
  private thumbnailVerticalScope: number = 180;
  private thumbnailHorizontalScope: number = 91;
  private isPlatformBrowser: boolean;
  private subscription: Subscription;
  @ViewChild('galleryThumbItem') galleryThumbItem: ElementRef;
  iframe: any;

  faPlay = faPlay;

  constructor(
    public activeModal: NgbActiveModal,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isPlatformBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.iframe = document.createElement("iframe");
    this.iframe.src = this.images[0].documentName;
    this.iframe.allowFullscreen = true;
    this.iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";

    if (this.isPlatformBrowser) {
      this.detectScreenSize();
      this.setIframeSrc();
    }
  }

  ngAfterViewInit() {
    this.subscription = timer(1000).subscribe(() => this.thumbnailWidth = this.galleryThumbItem.nativeElement.offsetWidth);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.thumbnailWidth = this.galleryThumbItem.nativeElement.offsetWidth;
    this.detectScreenSize();
  }

  private detectScreenSize() {
    if (window.innerWidth > 991) {
      this.thumbnailPosition = {
        'top': `${this.activeImageIndex * this.thumbnailHeight * -1 + this.thumbnailVerticalScope}px`
      }
    } else {
      this.thumbnailPosition = {
        'right': `${this.activeImageIndex * this.thumbnailWidth * -1 + this.thumbnailHorizontalScope}px`
      }
    }
  }

  changeImage(index: number) {
    if (index < 0) {
      this.activeImageIndex = 0;
      return;
    } else if (index > this.images.length - 1) {
      this.activeImageIndex = this.images.length - 1;
      return;
    }
    if (this.images[0].isVideo) {
      if (index == 0) {
        this.setIframeSrc();
      } else if (document.getElementById("product-video").hasChildNodes()) {
        document.getElementById("product-video").removeChild(this.iframe);
      }
    }
    this.activeImageIndex = index;
    this.detectScreenSize();
  }

  setIframeSrc() {
    setTimeout(() => {
      document.getElementById("product-video").appendChild(this.iframe);
    }, 200);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSwipe(event) {
    if (Math.abs(event.deltaY) > 40) {
      if (event.deltaY > 0) {
        this.changeImage(this.activeImageIndex - 1);
      } else {
        this.changeImage(this.activeImageIndex + 1);
      }
    } else if (Math.abs(event.deltaX) > 40) {
      if (event.deltaX > 0) {
        this.changeImage(this.activeImageIndex + 1);
      } else {
        this.changeImage(this.activeImageIndex - 1);
      }
    }
  }
}
