import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    if (url.indexOf('?') == -1) {
      url = url.toLowerCase();
    } else {
      const urlParts: string[] = url.split('?');
      url = `${urlParts[0].toLowerCase()}?${urlParts[1]}`;
    }
    return super.parse(url);
  }
}
