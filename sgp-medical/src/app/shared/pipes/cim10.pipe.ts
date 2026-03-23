import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cim10'
})
export class Cim10Pipe implements PipeTransform {
  private readonly codes: Record<string, string> = {
    'J44': 'Bronchopneumopathie chronique obstructive',
    'I10': 'Hypertension arterielle essentielle',
    'E11': 'Diabete de type 2',
    'F32': 'Episode depressif'
  };

  transform(code: string | undefined | null): string {
    if (!code) return '';
    return this.codes[code] ?? code;
  }
}
