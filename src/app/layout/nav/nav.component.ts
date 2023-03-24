import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, IProductCategory } from 'src/app/routes/product';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { faBars, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/toast/toast.service';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/routes/user/shared';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger(
      'megaMenuOverlayAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.2s cubic-bezier(.215,.61,.355,1)', style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.2s cubic-bezier(.215,.61,.355,1)', style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class NavComponent implements OnInit, OnDestroy {
  keyword: FormControl = new FormControl('', [Validators.minLength(3)]);
  categories: IProductCategory[];
  megaMenuState: 'up' | 'down' = 'up';
  activeMenu: string;
  indicatorTop: number;
  faBars = faBars;
  faSearch = faSearch;
  faTimesCircle = faTimesCircle;
  subscription: Subscription;
  logInOutSubscription: Subscription;
  timer: number;
  loading: boolean;
  searchResult: any = [];
  isBrowser: boolean;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService,
    public userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.productService.getProductGroup().subscribe(response => {
      this.categories = response.data;            
    });
    this.logInOutSubscription = this.userService.logInOutSubject.subscribe((data: boolean) => {
      if (data) {
        this.productService.getProductGroup().subscribe(response => {
          this.categories = response.data;
        });
      }

    });

  }
  ngOnDestroy(): void {
    this.logInOutSubscription.unsubscribe();
  }


  @HostListener('document:click', ['$event.target']) clickout(element: HTMLElement) {
    if (this.megaMenuState === 'down' &&
      ((element.nodeName === 'A' && !element.classList.contains('d-block') && element.closest('.mega-menu')) ||
        (!element.classList.contains('mega-menu-toggle') && !element.closest('.mega-menu')))
    ) {
      this.megaMenuState = 'up';
    }
  }

  getRootCategories(): IProductCategory[] {
    if (this.categories == undefined) return [];
    return this.categories.filter(item => item.parentId == null)
  }

  getChildCategories(id: string): IProductCategory[] {
    return this.categories.filter(item => item.parentId == id)
  }

  toggleMegaMenu() {
    this.megaMenuState = this.megaMenuState === 'up' ? 'down' : 'up';
    if (this.megaMenuState === 'down' && this.isBrowser) {
      if (window.innerWidth > 767)
        this.activeMenu = this.categories[0].code;
      this.indicatorTop = 40;
    }
  }

  onRootLi(event, name) {
    this.activeMenu = name;
    this.indicatorTop = event.target.offsetTop;
  }

  searchProduct() {
    this.searchResult = [];
    clearTimeout(this.timer);
    if (this.keyword.value != '' && this.keyword.invalid) return;
    this.loading = true;
    if (this.subscription != undefined)
      this.subscription.unsubscribe();

    this.timer = window.setTimeout(() => {
      if (this.keyword.value != '')
        this.subscription = this.productService.productSearchKeyword({ MarketingProductName: this.keyword.value })
          .subscribe(response => {
            this.loading = false;
            this.searchResult = response.data;
          });
    }, 800);
  }

  clearSearch() {
    this.keyword.setValue('');
  }

  searchProductName() {
    if (this.keyword.value.length < 3) {
      this.toastService.showWarning('برای جستجو حداقل باید ۳ حرف وارد نمایید.');
    } else {
      this.router.navigate(['/search', this.keyword.value]);
      this.clearSearch();
    }
  }
}
