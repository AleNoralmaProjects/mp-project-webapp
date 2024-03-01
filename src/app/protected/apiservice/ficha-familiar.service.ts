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
    gender?: any,
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
    !gender ? (gender = '') : 0;
    !rbiological ? (rbiological = '') : 0;
    !renvironmental ? (renvironmental = '') : 0;
    !rsocioeconomic ? (rsocioeconomic = '') : 0;
    !gpriority ? (gpriority = '') : 0;
    !gvulnerable ? (gvulnerable = '') : 0;

    return new Promise(async (result, refused) => {
      await this._poolService
        .get(
          `ficha-familiar/location?year=${year}&age=${age}&gender=${gender}&rbiological=${rbiological}&renvironmental=${renvironmental}&rsocioeconomic=${rsocioeconomic}&gpriority=${gpriority}&gvulnerable=${gvulnerable}`
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
          (datac) => {
            result(datac);
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
            result(data);
          },
          (error) => {
            refused(error);
          }
        );
    });
  }

  getLocationPregnats(type: number): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-pregnats/${type}`)
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

  getObesityChildren(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/obesity-children?year=${year}`)
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

  getLocationObesity(type: boolean): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-obesity/${type}`)
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

  getMalnutritionChildren(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/malnutrition-children?year=${year}`)
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

  getLocationMalnutrition(type: number): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-malnutrition/${type}`)
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

  getDisability(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/disability?year=${year}`)
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

  getLocationDisability(type: string): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-disability/${type}`)
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

  getDiseases(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/diseases?year=${year}`)
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

  getLocationDiseases(type: string, type2?: string): Promise<any> {
    !type2 ? (type2 = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-diseases/${type}?typeds2=${type2}`)
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

  getPersonPrior(year?: string): Promise<any> {
    !year ? (year = '') : 0;
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/personprior?year=${year}`)
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

  getLocationPersonPrior(type: string): Promise<any> {
    return new Promise(async (result, refused) => {
      await this._poolService
        .get(`ficha-familiar/risk-personprior/${type}`)
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
}
