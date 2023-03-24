import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { IPage } from './../../../shared/_interfaces/pages';
import { PagesService } from '@shared/_services/pages.service';
import { IResponse } from '@shared/.';

@Component({
  templateUrl: './accept-site-policy.component.html',
  styleUrls: ['./accept-site-policy.component.scss']
})
export class AcceptSitePolicyComponent implements OnInit {
  pageData: IPage;
  acceptedPolicy = new FormControl(false, [Validators.required]);

  constructor(
    private title: Title,
    private pagesService: PagesService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.title.setTitle('قبول قوانین سایت');
    this.getPageContent();
  }

  getPageContent() {
    this.pagesService.getPageDetail('sitepolicy').subscribe(response => {
      this.pageData = response.data;
    });
  }
  submitPolicy(): void {
    if (!this.acceptedPolicy.value) return;
    this.http.post<IResponse>(`${environment.apiUrl}/User/AcceptPolicy`, {}).subscribe(() => {
      this.router.navigate(['cart/shipping']);
    });
  }
}
