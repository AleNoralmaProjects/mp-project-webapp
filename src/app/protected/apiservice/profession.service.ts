import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profesion } from '../prointerfaces/api.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProfessionService {
  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlProfessionService: string = `${this.baseUrl}/profesion/`;

  constructor(private http: HttpClient) {}

  createProfessionInApi(profession: Profesion): Observable<Profesion> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionService}register`;

    return this.http.post<Profesion>(url, profession, { headers });
  }

  showProfessionInApi(): Observable<Profesion[]> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionService}list`;

    return this.http.get<Profesion[]>(url, { headers });
  }

  updateProfessionInApi(
    term: string,
    profession: Profesion
  ): Observable<Profesion> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateProfessionUrl = `${this.apiUrlProfessionService}update/${term}`;

    return this.http.patch<Profesion>(updateProfessionUrl, profession, {
      headers,
    });
  }
}
