import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Global, IResponse } from '@shared/.';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { usernameValidator } from 'src/app/helpers';

@Component({
  selector: 'app-update-username',
  templateUrl: './update-username.component.html',
  styleUrls: ['./update-username.component.scss']
})
export class UpdateUsernameComponent implements OnInit {
  usernameUpdateForm: FormGroup;
  isSubmitted: boolean;
  showLoading: boolean;
  showHint: boolean;
  global = Global;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router) { 
      this.isSubmitted = false;
      this.showLoading = true;
    }

  ngOnInit(): void {
    this.title.setTitle('نام کاربری');
    this.usernameUpdateForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        usernameValidator()
      ]]
    });
    this.getUsername();
  }

  getUsername(): void {
    this.http.get<IResponse<{ username: string }>>(`${environment.apiUrl}/user/getusername`)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(response => {
        this.usernameUpdateForm.setValue({ username: response.data.username });
        this.usernameUpdateForm.markAllAsTouched();
        if (/^\d+$/.test(this.username.value)) this.showHint = true;
      });
  }

  onSubmit(): void {
    if (this.usernameUpdateForm.invalid) return;
    this.isSubmitted = true;
    this.updateUsername(this.username.value)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(
        () => this.router.navigate(['/profile'])
      );
  }

  updateUsername(username: string): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.apiUrl}/user/updateUsername`, {username})
  }

  get username(): AbstractControl {
    return this.usernameUpdateForm.get('username');
  }
}
