import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private _provincias = 24;
  constructor(private _toastService: ToastrService) {}

  toastInformation(message: string, title?: string) {
    let title_l = 'Información';
    if (title) {
      title_l = title;
    }

    this._toastService.info(message, title, {
      timeOut: 1500,
    });
  }

  toastWarning(message: string, title?: string) {
    let title_l = 'Advertencia';
    if (title) {
      title_l = title;
    }

    this._toastService.info(message, title, {
      timeOut: 1500,
    });
  }

  validateIdentityCard(cedula: string): boolean {
    let valido = false;

    if (!cedula || cedula.length !== 10) {
      return false;
    }
    const prov = parseInt(cedula.substring(0, 2), 10);

    if (!(prov > 0 && prov <= this._provincias)) {
      return false;
    }

    const d = [];

    for (let i = 0; i < 10; i++) {
      d[i] = parseInt(cedula.charAt(i) + '', 10);
    }

    let imp = 0;
    let par = 0;

    for (let i = 0; i < d.length; i += 2) {
      d[i] = d[i] * 2 > 9 ? d[i] * 2 - 9 : d[i] * 2;
      imp += d[i];
    }

    for (let i = 1; i < d.length - 1; i += 2) {
      par += d[i];
    }
    const suma = imp + par;
    const sum: string = suma + 10 + '';
    const sumastring = sum;
    let d10 = parseInt(sumastring.substring(0, 1) + '0', 10) - suma;
    d10 = d10 === 10 ? 0 : d10;
    valido = d10 === d[9];
    return valido;
  }
}
