import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastService } from '@shared/toast/toast.service';
import { ForgetPasswordResult, ForgetPasswordByCodeResult, ForgetPasswordSteps } from '../shared';

@Component({
  selector: 'app-forget-password-layout',
  templateUrl: './forget-password-layout.component.html',
  styleUrls: ['./forget-password-layout.component.scss']
})
export class ForgetPasswordLayoutComponent implements OnInit {
  private steps: ForgetPasswordSteps[];
  currentStep: ForgetPasswordSteps;
  userId: string;
  mobileNumber: string;
  
  constructor(
    private title: Title, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('فراموشی رمز عبور');
    this.steps = [
      { id: 1, name: 'forgetPassword'},
      { id: 2, name: 'forgetPasswordByCode'},
      { id: 3, name: 'resetPassword'}
    ]
    this.currentStep = this.steps[0];
  }

  private goToNextStep(): void {
    this.currentStep = this.steps[this.currentStep.id];
  }

  private goToLastStep(): void {
    this.currentStep = this.steps[this.steps.length-1];
  }

  onForgetPasswordSubmit(value: ForgetPasswordResult & {mobileNumber}) {
    if(value.moreDetailsAreNeeded) {
      this.mobileNumber = value.mobileNumber;
      this.goToNextStep();
    } else {
      this.userId = value.userId;
      this.goToLastStep();
    }
  }

  onForgetPasswordByCodeSubmit(value: ForgetPasswordByCodeResult) {
    this.userId = value.id;
    this.goToNextStep();
  }

  onResetPasswordSubmit() {
    this.router.navigate(['/user/login']);
  }
  
}
