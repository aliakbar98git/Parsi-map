import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommentGet } from '../shared';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { IResponse } from '@shared/.';

@Component({
  selector: 'app-comments',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  commentList: CommentGet[];
  showLoading: boolean;

  constructor(
    private title: Title,
    private http: HttpClient
  ) {
    this.showLoading = true;
   }

  ngOnInit(): void {
    this.title.setTitle('لیست کامنت');
    this.getCommentList();
  }

  getCommentList(): void {
    this.http.get<IResponse<CommentGet[]>>(`${environment.apiUrl}/comment/getComment`)
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(
        response => {
          this.commentList = response.data;
        }
      );
  }
}
