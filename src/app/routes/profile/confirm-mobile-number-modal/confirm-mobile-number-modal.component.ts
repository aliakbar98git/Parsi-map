import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global, SharedService } from '@shared/.';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-mobile-number-modal',
  templateUrl: './confirm-mobile-number-modal.component.html',
  styleUrls: ['./confirm-mobile-number-modal.component.scss']
})
export class ConfirmMobileNumberModalComponent implements OnInit {
  confirmMobileNumberForm: FormGroup;
  isSubmitted: boolean;
  global = Global;
  userId: string;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.confirmMobileNumberForm = this.formBuilder.group({
      code: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.confirmMobileNumberForm.invalid) return;
    this.isSubmitted = true;
    this.sharedService.confirmMobileNumber({ code: this.code.value })
    .pipe(finalize(() => {this.isSubmitted = false;}))
    .subscribe(() => this.activeModal.close());
  }

  get code(): AbstractControl {
    return this.confirmMobileNumberForm.get("code");
  }
}
