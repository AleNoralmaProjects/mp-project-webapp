import { Pipe, PipeTransform } from '@angular/core';
import { Profesional } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterProfessional',
})
export class FilterProfessionalPipe implements PipeTransform {
  transform(value: Profesional[], searchString: string) {
    if (searchString === '' || !searchString) {
      return value;
    }

    return value.filter((itemProfessional) =>
      `${itemProfessional.nombres} ${itemProfessional.apellidos}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }
}
