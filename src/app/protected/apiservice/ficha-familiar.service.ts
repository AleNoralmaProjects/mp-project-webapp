import { Injectable } from '@angular/core';
import { PoolService } from './pool.service';

@Injectable({
  providedIn: 'root',
})
export class FichaFamiliarService {
  constructor(private _poolService: PoolService) {}

  getLocation(
    year?: any,
    age?: any,
    rbiological?: any,
    renvironmental?: any,
    rsocioeconomic?: any,
    gpriority?: any,
    gvulnerable?: any
  ): Promise<any> {
    /*TODO: IF ITERATIVO 
    El cero significa que no va hacer nada, significativo el else. 
    Despues de los : significa que va el else  */
    !year ? (year = '') : 0;
    !age ? (age = '') : 0;
    !rbiological ? (rbiological = '') : 0;
    !renvironmental ? (renvironmental = '') : 0;
    !rsocioeconomic ? (rsocioeconomic = '') : 0;
    !gpriority ? (gpriority = '') : 0;
    !gvulnerable ? (gvulnerable = '') : 0;

    return new Promise(async (result, refused) => {
      await this._poolService
        .get(
          `ficha-familiar/location?year=${year}&age=${age}&rbiological=${rbiological}&renvironmental=${renvironmental}&rsocioeconomic=${rsocioeconomic}&gpriority=${gpriority}&gvulnerable=${gvulnerable}`
        )
        .subscribe(
          (data) => {
            result(data);
          },
          (error) => {
            refused(error);
          }
        );
    });
  }

  getCategories(): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService.get(`ficha-familiar/categories`).subscribe(
        (data) => {
          result(data);
        },
        (error) => {
          refused(error);
        }
      );
    });
  }

  getSearchId(cedula: string): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/searchId?${cedula}`)
        .subscribe(
          (data) => {
            console.log('data=', data);
            result(data);
          },
          (error) => {
            refused(error);
          }
        );
    });
  }

  getPregnats(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/pregnats?year=${year}`)
        .subscribe(
          (data) => {
            console.log('data=', data);
            result(data);
          },
          (error) => {
            refused(error);
          }
        );
    });
  }
}
