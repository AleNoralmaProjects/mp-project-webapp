import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoEais } from '../prointerfaces/api.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class InfoEaisService {
  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlInfoEaisService: string = `${this.baseUrl}/info-eais/`;

  constructor(private http: HttpClient) {}

  createInfoEaisInApi(infoEais: InfoEais): Observable<InfoEais> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlInfoEaisService}register`;

    return this.http.post<InfoEais>(url, infoEais, { headers });
  }

  showInfoEaisInApi(): Observable<InfoEais[]> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlInfoEaisService}list`;

    return this.http.get<InfoEais[]>(url, { headers });
  }

  searchInfoEaisInApi(term: string): Observable<InfoEais> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlInfoEaisService}search/${term}`;

    return this.http.get<InfoEais>(url, { headers });
  }
}
