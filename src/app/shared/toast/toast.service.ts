import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showSuccess(textOrTpl: string | TemplateRef<any>, options: any = { classname: 'bg-success text-white' }) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showDanger(textOrTpl: string | TemplateRef<any>, options: any = { classname: 'bg-danger text-white' }) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showInfo(textOrTpl: string | TemplateRef<any>, options: any = { classname: 'bg-info text-white' }) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showWarning(textOrTpl: string | TemplateRef<any>, options: any = { classname: 'bg-warning text-dark' }) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
