import { Injectable } from '@angular/core';
import { AuthResponse, UpdateToken, User } from '../interface/auth.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user!: User;

  get user() {
    return { ...this._user };
  }

  /* private readonly baseUrl: string = environment.globalUrl;
  private apiUrlBrigadeEaisService: string = `${this.baseUrl}/brigada-eais/`; */

  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlLogin: string = `${this.baseUrl}/profesional/`;

  constructor(private http: HttpClient) {}

  /*   servicio para autenticacion  for backend */
  loginConection(user: string, password: string) {
    /*  const url = 'http://localhost:3000/mp-api/profesional/login'; */
    const url = `${this.apiUrlLogin}login`;
    const body_query = { user, password };
    return this.http.post<AuthResponse>(url, body_query).pipe(
      tap((resp) => {
        /* borrar cuando este en produc */
        console.log(resp);

        if (resp.ok) {
          localStorage.setItem('token', resp.token);
          this._user = {
            id: resp.id_profesional,
            role: resp.role,
            user: resp.user,
          };
        }
      }),
      map((resp) => resp.id_profesional),
      catchError((error) => of(error.error.message))
    );
  }

  tokenValidation(): Observable<boolean> {
    const url = `${this.apiUrlLogin}status-verify`;
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    return this.http.get<UpdateToken>(url, { headers }).pipe(
      map((resp) => {
        console.log(headers);
        localStorage.setItem('token', resp.token!);
        this._user = {
          id: resp.id_profesional!,
          role: resp.role!,
          user: resp.user!,
        };
        console.log(resp);
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  /* Destruir llamado login */
  logOut() {
    localStorage.removeItem('token');
  }
}
