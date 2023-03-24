import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private httpClient: HttpClient) { }

  upload(formData: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/Document/Upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
