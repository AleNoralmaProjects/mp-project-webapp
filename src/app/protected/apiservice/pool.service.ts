import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PoolService {
  private readonly baseUrl: string = environment.globalUrl;
  constructor(private httpCliente: HttpClient) {}

  get(service: string, options?: any): Observable<object> {
    const url = `${this.baseUrl}/${service}`;
    return this.httpCliente.get(url, options);
  }
}
