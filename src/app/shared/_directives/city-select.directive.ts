import { Directive, HostListener, OnDestroy, OnInit, Input, Host } from '@angular/core';
import { Subscription, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize, tap } from 'rxjs/operators';
import { ICityOrParish, SharedService } from '..';
import { environment } from '@environments/environment';
import { IResponse } from '@shared/.';
@Directive({
  selector: '[appCitySelect]'
})
export class CitySelectDirective implements OnInit, OnDestroy {
  @Input('appCitySelect') linkedSelectComponent: NgSelectComponent;
  private citiesListSubscription: Subscription;
  private linkedComponentPreviousValue = null;
  private hostComponentPreviousValue = null;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    @Host() private hostSelectComponent: NgSelectComponent
  ) {
   }

  @HostListener('clear') onClear(): void {
    this.updateLinkedComponent([], false);
    this.linkedSelectComponent.clearModel();
  }

  @HostListener('change', ['$event']) onChange(event: any): void {
    if (event) {
      this.getParishes(event.cityOrParishId).subscribe(() => {
        if (this.linkedSelectComponent.hasValue) {
          this.linkedSelectComponent.clearModel();
        }
      });
    }
  }

  ngOnInit(): void {
    this.updateHostComponent([], true);
    this.updateLinkedComponent([], true);
    this.citiesListSubscription = this.sharedService.cities
      .subscribe(cities => {
        this.updateHostComponent(cities, false);
        this.hostSelectComponent.detectChanges();
        this.sharedService.getAddrestIdToMap.next(cities)
      });
    if (this.hostSelectComponent.hasValue) {
      this.getParishes(this.hostSelectComponent.selectedValues[0]['cityOrParishId']).subscribe()
    }
  }

  private getParishes(cityId: string): Observable<IResponse<ICityOrParish[]>> {
    this.linkedSelectComponent.loading = true;
    this.linkedSelectComponent.detectChanges();
    return this.http.get<IResponse<ICityOrParish[]>>(`${environment.apiUrl}/countryDivision/getCityOrParish/${cityId}`)
      .pipe(
            tap(response => {
              this.updateLinkedComponent(response.data, false);
            }),
            finalize(() => {
              this.linkedSelectComponent.loading = false;
              this.linkedSelectComponent.detectChanges();
            })
      );
  }

  private updateHostComponent(items: ICityOrParish[], isFirstChange: boolean): void {
    this.hostSelectComponent.items = items;
    this.hostSelectComponent.ngOnChanges({
      items: {
        previousValue: this.hostComponentPreviousValue,
        currentValue: this.hostSelectComponent.items,
        firstChange: isFirstChange,
        isFirstChange: () => isFirstChange,
      }
    });
    this.linkedComponentPreviousValue = items;
  }

  private updateLinkedComponent(items: ICityOrParish[], isFirstChange: boolean): void {
    this.linkedSelectComponent.items = items;
    this.linkedSelectComponent.ngOnChanges({
      items: {
        previousValue: this.linkedComponentPreviousValue,
        currentValue: this.linkedSelectComponent.items,
        firstChange: isFirstChange,
        isFirstChange: () => isFirstChange,
      }
    });
    this.linkedComponentPreviousValue = items;
  }
  
  ngOnDestroy(): void {
    this.citiesListSubscription.unsubscribe();
  }
}
