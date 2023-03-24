import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastService } from '@shared/toast/toast.service';
import { ForgetUsernameResult, ForgetUsernameByCodeResult, ForgetUsernameSteps } from '../shared';

@Component({
  selector: 'app-forget-username-layout',
  templateUrl: './forget-username-layout.component.html',
  styleUrls: ['./forget-username-layout.component.scss']
})
export class ForgetUsernameLayoutComponent implements OnInit {
  private steps: ForgetUsernameSteps[];
  currentStep: ForgetUsernameSteps;
  userId: string;
  mobileNumber: string;
  
  constructor(
    private title: Title, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('فراموشی نام کاربری');
    this.steps = [
      { id: 1, name: 'forgetUsername'},
      { id: 2, name: 'forgetUsernameByCode'},
      { id: 3, name: 'resetUsername'}
    ]
    this.currentStep = this.steps[0];
  }

  private goToNextStep(): void {
    this.currentStep = this.steps[this.currentStep.id];
  }

  private goToLastStep(): void {
    this.currentStep = this.steps[this.steps.length-1];
  }

  onForgetUsernameSubmit(value: ForgetUsernameResult & {mobileNumber}) {
    if(value.moreDetailsAreNeeded) {
      this.mobileNumber = value.mobileNumber;
      this.goToNextStep();
    }else {
      this.userId = value.userId;
      this.goToLastStep();
    }
  }

  onForgetUsernameByCodeSubmit(value: ForgetUsernameByCodeResult) {
    this.userId = value.id;
    this.goToNextStep();
  }

  onResetUsernameSubmit() {
    this.router.navigate(['/user/login']);
  }

}
