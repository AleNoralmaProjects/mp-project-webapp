import { Pipe, PipeTransform } from '@angular/core';
import { BrigadaEAIS } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterBrigadeeais',
})
export class FilterBrigadeeaisPipe implements PipeTransform {
  transform(value: BrigadaEAIS[], searchString: string) {
    if (searchString === '' || !searchString) {
      return value;
    }
    return value.filter((itemBrigadeeais) =>
      /* `${itemBrigadaeais.profesional.nombres}${itemBrigadaeais.profesional.apellidos}`
      .toLowerCase()
      .includes(searchString.toLowerCase()) */
      `${itemBrigadeeais.eais.cod_eais.toLowerCase()}`.includes(
        searchString.toLowerCase()
      )
    );
  }
}
