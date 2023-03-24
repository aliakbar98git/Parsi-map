import { Injectable } from '@angular/core';
import { codeDictionary } from 'src/assets/locales/code-messages.fa';
import { enumDictionary } from 'src/assets/locales/enum-messages.fa';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(
  ) {
  }

  translateCode(key: number, params: any[]): string {
    if (codeDictionary.has(key)) {
      if (params && params.length > 0) {
          let counter = 0;
          return codeDictionary.get(key).replace(/{x}/g, function() {
            return params[counter++];
          })
      } else return codeDictionary.get(key);
    } else return '';
  }

  translateEnum(key: string): string {
    return enumDictionary.has(key) ? enumDictionary.get(key) : enumDictionary.get('Unspecified');
  }
}
