import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profesional, UpdateProfesional } from '../prointerfaces/api.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlProfessionalService: string = `${this.baseUrl}/profesional/`;

  constructor(private http: HttpClient) {}

  createProfessionalInApi(professional: Profesional): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}register`;

    return this.http.post<Profesional>(url, professional, { headers });
  }

  showProfessionalinApi(): Observable<Profesional[]> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}list`;

    return this.http.get<Profesional[]>(url, { headers });
  }

  updateProfessionalInApi(
    term: string,
    professional: Profesional
  ): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateProfessionalUrl = `${this.apiUrlProfessionalService}update/${term}`;

    return this.http.patch<Profesional>(updateProfessionalUrl, professional, {
      headers,
    });
  }

  updateProfessionalStateInApi(
    idUpdateProfesional: string,
    profesional: UpdateProfesional
  ): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateProfesionalUrl = `${this.apiUrlProfessionalService}update/${idUpdateProfesional}`;

    return this.http.patch<Profesional>(updateProfesionalUrl, profesional, {
      headers,
    });
  }

  updatePasswordInApi(term: string, password: any): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const updateProfesionalUrl = `${this.apiUrlProfessionalService}update-password/${term}`;

    return this.http.patch<Profesional>(updateProfesionalUrl, password, {
      headers,
    });
  }

  showActiveProfessionalinApi(): Observable<Profesional[]> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}listProfesionalActive`;

    return this.http.get<Profesional[]>(url, { headers });
  }

  shearchProfessionalinApi(id: string): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}search/${id}`;

    return this.http.get<Profesional>(url, { headers });
  }

  shearchProfessionalBrigadaEaisEnable(id: string): Observable<Profesional> {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}searchEaisEnable/${id}`;

    return this.http.get<Profesional>(url, { headers });
  }

  verifyProfessionalUser(term: string) {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = `${this.apiUrlProfessionalService}user-verify/${term}`;

    return this.http.get(url, { headers });
  }
}
