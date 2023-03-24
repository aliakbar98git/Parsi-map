import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({
  name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
  transform(value: any, format: string = 'YYYY/M/D'): any {
    if (value == null || value == '') return '';
    let MomentDate = moment(value);
    return MomentDate.locale('fa').format(format);
  }
}
