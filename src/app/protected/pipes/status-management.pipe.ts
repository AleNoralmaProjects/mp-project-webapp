import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusManagement',
})
export class StatusManagementPipe implements PipeTransform {
  transform(estado: boolean): string {
    if (estado) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }
}
