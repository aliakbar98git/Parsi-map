import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { PasswordUpdate } from '../shared';
import { Global, IResponse, PasswordConfirmation } from '@shared/.';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  passwordUpdateForm: FormGroup;
  isSubmitted: boolean;
  global = Global;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('رمز عبور');
    this.passwordUpdateForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordFields: [null]
    });
  }

  onSubmit(): void {
    if (this.passwordUpdateForm.invalid) return;
    this.isSubmitted = true;
    this.updatePassword({
      currentPassword: this.currentPassword.value,
      ...this.newPasswordFields
    })
    .pipe(finalize(() => this.isSubmitted = false))
    .subscribe(
      () => this.router.navigate(['/profile'])
    );
  }

  updatePassword(data: PasswordUpdate): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.apiUrl}/user/updatePassword`, data)
  }

  get currentPassword(): AbstractControl {
    return this.passwordUpdateForm.get("currentPassword");
  }

  get newPasswordFields(): PasswordConfirmation {
    return this.passwordUpdateForm.get("newPasswordFields").value;
  }
}
