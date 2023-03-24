import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentUrl;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    let splitUrl = this.router.url.split('/');
    this.currentUrl = splitUrl[splitUrl.length - 1];

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        splitUrl = event.url.split('/');
        this.currentUrl = splitUrl[splitUrl.length - 1];
      }

    });

  }

}
