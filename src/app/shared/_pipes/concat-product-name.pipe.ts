import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatProductName'
})
export class  ConcatProductNamePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/[\.\s]/g,'-');
  }

}
