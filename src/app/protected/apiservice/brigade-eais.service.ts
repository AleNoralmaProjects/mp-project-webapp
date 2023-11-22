import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BrigadaEAIS, UpdateBrigadaEais } from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BrigadeEaisService {
  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlBrigadeEaisService: string = `${this.baseUrl}/brigada-eais/`;

  constructor(private http: HttpClient) {}

  createBrigadeEaisInApi(brigadaEais: BrigadaEAIS): Observable<BrigadaEAIS> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlBrigadeEaisService}register`;

    return this.http.post<BrigadaEAIS>(url, brigadaEais, { headers });
  }

  showBrigadeEaisInApi(): Observable<BrigadaEAIS[]> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlBrigadeEaisService}list`;

    return this.http.get<BrigadaEAIS[]>(url, { headers });
  }

  updateBrigadeEaisInApi(
    idUpdateBrigada: string,
    brigadaEais: BrigadaEAIS
  ): Observable<BrigadaEAIS> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateBrigadaEaisUrl = `${this.apiUrlBrigadeEaisService}update/${idUpdateBrigada}`;

    return this.http.patch<BrigadaEAIS>(updateBrigadaEaisUrl, brigadaEais, {
      headers,
    });
  }

  updateBrigadeEaisStateInApi(
    idUpdateBrigada: string,
    brigadaEais: UpdateBrigadaEais
  ): Observable<BrigadaEAIS> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateBrigadaEaisUrl = `${this.apiUrlBrigadeEaisService}update/${idUpdateBrigada}`;

    return this.http.patch<BrigadaEAIS>(updateBrigadaEaisUrl, brigadaEais, {
      headers,
    });
  }
}
