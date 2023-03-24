import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { finalize } from 'rxjs/operators';
import { usernameValidator } from 'src/app/helpers';
import { ResetUsername } from '../shared';

@Component({
  selector: 'app-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['./reset-username.component.scss']
})
export class ResetUsernameComponent implements OnInit {
  resetUsernameForm: FormGroup;
  isSubmitted: boolean;
  @Input() userId: string;
  @Output() onSuccessSubmit = new EventEmitter<void>();
  global = Global;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.resetUsernameForm = this.formBuilder.group({
      code: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        usernameValidator()
      ]]
    });
  }

  onSubmit(): void {
    if (this.resetUsernameForm.invalid) return;
    this.isSubmitted = true;
    const resetUsernameData: ResetUsername = {
      userId: this.userId,
      code: this.code.value,
      username: this.username.value
    };

    this.http.post<IResponse>(`${environment.apiUrl}/user/resetusername`, resetUsernameData)
    .pipe(finalize(() => this.isSubmitted = false))
    .subscribe(
      () => this.onSuccessSubmit.emit()
    );
  }

  get code(): AbstractControl {
    return this.resetUsernameForm.get("code");
  }

  get username(): AbstractControl {
    return this.resetUsernameForm.get("username");
  }
}
