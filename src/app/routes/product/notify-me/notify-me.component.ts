import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { faBell, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { IResponse } from '@shared/.';
import { atLeastOneControlIsTrueValidator } from 'src/app/helpers';
import { IGetInventoryAnnouncement } from '..';
import { UserService } from '../../user/shared';

@Component({
  selector: 'app-notify-me',
  templateUrl: './notify-me.component.html',
  styleUrls: ['./notify-me.component.scss']
})
export class NotifyMeComponent implements OnInit {
  @Input() marketingProductId: string;
  inventoryAnnouncementForm: FormGroup;
  inventoryAnnouncementItems: IGetInventoryAnnouncement;
  activeModal;
  isSubmitted = false;
  faBell = faBell;
  faInfoCircle = faInfoCircle;

  constructor(
    private modalService: NgbModal, 
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inventoryAnnouncementForm = this.formBuilder.group({
      announceByEmail: [false],
      announceBySms: [false]
    }, { 
      validators: atLeastOneControlIsTrueValidator(['announceByEmail', 'announceBySms'])
    });
  }

  openModal(content) {
    if(!this.userService.isAuthenticated) {
      this.router.navigate(['/user/login']);
      return;
    }
    if (!this.inventoryAnnouncementItems) this.getInventoryAnnouncement();
    this.isSubmitted = false;
    this.inventoryAnnouncementForm.reset({
      announceByEmail: false,
      announceBySms: false
    });
    this.activeModal = this.modalService.open(content, { centered: true });
  }

  getInventoryAnnouncement() {
    this.http.get<IResponse<IGetInventoryAnnouncement>>(`${environment.apiUrl}/inventoryannouncement/getinventoryannouncement`)
      .subscribe(res => this.inventoryAnnouncementItems = res.data);
  }

  onSubmit() {
    if (this.inventoryAnnouncementForm.invalid) return;
    this.isSubmitted = true;
    this.http.post<IResponse>(`${environment.apiUrl}/inventoryannouncement/createinventoryannouncement`, 
      { marketingProductId: this.marketingProductId , ...this.inventoryAnnouncementForm.value})
      .subscribe(() => this.activeModal.close(), () => this.isSubmitted = false);
  }
}
