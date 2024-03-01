import { Injectable, computed, signal } from '@angular/core';
import {
  AuthResponse,
  AuthStatus,
  User,
  checkToken,
} from '../interface/auth.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.globalUrl;
  private apiUrlLogin: string = `${this.baseUrl}/profesional/`;

  /* TODO: SIGNAL
   ESTADOS DE INICIO  */
  private _currentlyUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  /*TODO: METODOS PUBLICOS  */

  public currentlyUser = computed(() => this._currentlyUser());
  public authStatus = computed(() => this._authStatus());

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  /* METODO PRIVADO */
  private setAuthentication(user: User, token: string): boolean {
    user.token = token;

    this._currentlyUser.set(user);
    this._authStatus.set(AuthStatus.authentication);

    localStorage.setItem('token', token);
    return true;
  }

  /*   servicio para autenticacion  for backend */
  loginConection(user: string, password: string): Observable<boolean> {
    const url = `${this.apiUrlLogin}login`;
    const body_query = { user, password };
    return this.http.post<AuthResponse>(url, body_query).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => {
        if (err.status === 0) {
          return throwError(
            () =>
              new Error(
                'No se pudo establecer conexión con el servidor. Por favor, inténtalo de nuevo más tarde.'
              )
          );
        } else {
          return throwError(() => new Error(err.error.message));
        }
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrlLogin}status-verify`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logOut();
      return of(false);
    }

    if (!this.isTokenValid(token)) {
      this.logOut();
      return of(false);
    }

    const bearerToken = `Bearer ${token}`;
    const headers = new HttpHeaders().set('Authorization', bearerToken);
    return this.http.get<checkToken>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.nonAuthenticacion);
        return of(false);
      })
    );
  }

  isTokenValid(token: string): boolean {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenData.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /* Destruir llamado login */
  logOut() {
    localStorage.removeItem('token');
    this._currentlyUser.set(null);
    this._authStatus.set(AuthStatus.nonAuthenticacion);
  }
}
