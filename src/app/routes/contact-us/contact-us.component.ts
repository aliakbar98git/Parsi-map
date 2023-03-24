import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Global, IResponse } from '@shared/.';
import { CaptchaService } from '@shared/_services/captcha.service';
import { finalize } from 'rxjs/operators';
import { DocumentType } from '@shared/_enums/documentType.enum';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

type ContactInfoSubject = {id: string; subjectTitle: string;}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  isSubmitted: boolean;
  subjectItems: ContactInfoSubject[];
  subjectItemsLoading: boolean;
  showCaptcha: boolean;
  global = Global;
  faPlus = faPlus;

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private captchaService: CaptchaService,
    private router: Router
  ) {
    this.isSubmitted = false;
    this.subjectItemsLoading = true;
    this.showCaptcha = false;
  }

  ngOnInit(): void {
    this.title.setTitle('تماس با ما');
    this.contactUsForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.minLength(11),
        Validators.maxLength(11)]],
      saleInvoiceNumber: [''],
      contactUsSubjectId: [null, Validators.required],
      messageInfo: ['', Validators.required],
      documentFiles: new FormArray([new FormControl()]),
      DNTCaptchaInputText: ['']
    });
    this.getSubjectsList();
  }

  public get getDocumentType(): typeof DocumentType {
    return DocumentType;
  }

  getSubjectsList(): void {
    this.http.get<IResponse<ContactInfoSubject[]>>(`${environment.apiUrl}/contactus/getcontactinfosubject`)
      .pipe(finalize(() => this.subjectItemsLoading = false))
      .subscribe(response => this.subjectItems = response.data);
  }

  onFileUpload(index: number, id: string) {
    this.documentFiles.controls[index].setValue(id);
  }

  addFile() {
    if (this.documentFiles.length < 3) this.documentFiles.push(new FormControl());
  }

  captchaSetValue(value: string) {
    this.DNTCaptchaInputText.setValue(value);
    this.DNTCaptchaInputText.markAsTouched();
  }

  captchaChangeValidators(status: boolean) {
    this.showCaptcha = status;
    if (status == true) {
      this.DNTCaptchaInputText.setValidators([Validators.required]);
      if (!this.DNTCaptchaInputText.touched)
        this.DNTCaptchaInputText.setErrors({ required: true });
    } else {
      this.DNTCaptchaInputText.clearValidators();
      this.DNTCaptchaInputText.setErrors(null)
    }
  }

  onSubmit(): void {
    if (this.contactUsForm.invalid) return;
    this.isSubmitted = true;
    let params = Object.assign({}, this.contactUsForm.value);
    if (!this.showCaptcha) delete params.DNTCaptchaInputText;
    else {
      params.DNTCaptchaText = this.captchaService.captchaParams.captcha.dntCaptchaTextValue;
      params.DNTCaptchaToken = this.captchaService.captchaParams.captcha.dntCaptchaTokenValue;
    }
    params.documentFiles = params.documentFiles.filter(file => file !== null);
    this.http.post<IResponse>(`${environment.apiUrl}/contactus/create`,  params)
      .pipe(finalize(() => this.isSubmitted = false))
      .subscribe(() => this.router.navigate(['/']));
  }


  get fullName(): AbstractControl {
    return this.contactUsForm.get('fullName');
  }

  get email(): AbstractControl {
    return this.contactUsForm.get('email');
  }

  get phoneNumber(): AbstractControl {
    return this.contactUsForm.get('phoneNumber');
  }

  get saleInvoiceNumber(): AbstractControl {
    return this.contactUsForm.get('saleInvoiceNumber');
  }

  get contactUsSubjectId(): AbstractControl {
    return this.contactUsForm.get('contactUsSubjectId');
  }

  get messageInfo(): AbstractControl {
    return this.contactUsForm.get('messageInfo');
  }

  get documentFiles(): FormArray {
    return this.contactUsForm.get('documentFiles') as FormArray;
  }

  get DNTCaptchaInputText(): AbstractControl {
    return this.contactUsForm.get("DNTCaptchaInputText");
  }

}
