import { Pipe } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'safehtml'
})

export class SafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer) { }

  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}
