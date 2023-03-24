import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '@shared/_services/shared.service';
import { finalize } from 'rxjs/operators';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resend-sms-security-code',
  templateUrl: './resend-sms-security-code.component.html',
  styleUrls: ['./resend-sms-security-code.component.scss']
})
export class ResendSmsSecurityCodeComponent implements OnInit {
  @Input() userId?: string;
  resendSmsSecurityCodeLoading: boolean;
  faRedo = faRedo;
  
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {    
  }

  resendSmsSecurityCode() {
    this.resendSmsSecurityCodeLoading = true;
    this.sharedService.resendSmsSecurityCode(this.userId)
      .pipe(finalize(() => this.resendSmsSecurityCodeLoading = false))
      .subscribe();
  }
}
