import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FavoriteProductGet } from '../shared';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FavoriteProductToggle, IResponse, SharedService } from '@shared/.';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favorite-products-list',
  templateUrl: './favorite-products-list.component.html',
  styleUrls: ['./favorite-products-list.component.scss']
})
export class FavoriteProductsListComponent implements OnInit {
  favoriteProductsList: FavoriteProductGet[];
  removeFavoriteModalRef: any;
  faTimes = faTimes;
  showLoading: boolean;

  constructor(
    private title: Title,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this.showLoading = true;
  }

  ngOnInit(): void {
    this.title.setTitle('لیست علاقه‌مندی');
    this.getFavoriteList();
  }

  getFavoriteList(): void {
    this.http.get<IResponse<FavoriteProductGet[]>>(`${environment.apiUrl}/favorite/getFavorite`)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(
        response => {
          this.favoriteProductsList = response.data;
        }
      );
  }

  openRemoveFavoriteItemModal(item: FavoriteProductGet): void {
    this.removeFavoriteModalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'sm' });
    this.removeFavoriteModalRef.componentInstance.title = 'حذف آیتم';
    this.removeFavoriteModalRef.componentInstance.data = {
      description: item.description,
      marketingProductId: item.marketingProductId
    };
    this.removeFavoriteModalRef.componentInstance.onConfirmationButton.subscribe(($event) => this.removeFavoriteItem($event));
  }

  removeFavoriteItem(item: FavoriteProductToggle): void {
    this.sharedService.toggleFavoriteItem(item)
      .pipe(
        finalize(() => this.removeFavoriteModalRef.close())
      )
      .subscribe(
        () => {
          this.favoriteProductsList = this.favoriteProductsList.filter(filterItem => filterItem.marketingProductId !== item.marketingProductId);
        }
      );
  }

}
