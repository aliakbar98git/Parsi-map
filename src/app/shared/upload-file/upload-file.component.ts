import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { DocumentType } from '@shared/_enums/documentType.enum';
import { UploadService } from '@shared/_services/upload.service';
import { UserService, UserType } from 'src/app/routes/user/shared';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() documentType: DocumentType;
  @Input() fieldName: string;
  @Input() enableDownload: boolean = false;
  @Input() fieldValue: string = undefined;
  @Output() onFileUpload: EventEmitter<any> = new EventEmitter();
  uploadProgress: number = 0;
  inProgress: boolean = false;
  uploaded: boolean;
  faDownload = faDownload;
  userType: typeof UserType;

  constructor(
    private uploadService: UploadService,
    public userService: UserService
  ) {
    this.userType = UserType;
  }

  ngOnInit(): void { }

  uploadFile(data: any) {
    this.onFileUpload.emit(null);
    const file = data[0];
    const formData = new FormData();
    formData.append('FormFile', file);
    formData.append('DocumentType', `${this.documentType}`);
    this.inProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError(() => {
        this.inProgress = false;
        this.uploaded = false;
        return of(`Upload failed: ${file.name}`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.inProgress = false;
          this.uploaded = true;
          this.onFileUpload.emit(event.body.data.id);
        }
      });
  }

  downloadFile() {
    window.open(`${environment.apiUrl}/Document/Download/${this.fieldValue}`, '_blank');
  }
}
