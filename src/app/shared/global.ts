import { AbstractControl } from '@angular/forms';

export class Global {
    static customPatterns = {
        'F': { pattern: new RegExp('\[ اآئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی\]') },
        'S': { pattern: new RegExp('\[ 0-9۰-۹a-zA-Zاآئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی./-\]') },
        'E': { pattern: new RegExp('\[ 0-9a-zA-Z\]') },
        'L': { pattern: new RegExp('\[a-zA-Z\]') },
        'C': { pattern: new RegExp('\[0-9a-zA-Z_.-\]') },
        'P': { pattern: new RegExp('\[^۰-۹اآئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی\]') },
        'A': { pattern: new RegExp('\[0-9a-z\]') },
        '0': { pattern: new RegExp('\[0-9۰-۹\]') },
        '9': { pattern: new RegExp('\[0-9۰-۹\]'), optional: true }
    };

    static hasError(field: AbstractControl): boolean {
        return (field.invalid && (field.touched || field.dirty));
    }
}
