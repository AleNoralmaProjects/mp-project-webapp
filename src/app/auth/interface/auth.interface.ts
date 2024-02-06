export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id_Profesional: string;
  user: string;
  role: string;
  token: string;
}

export interface checkToken {
  user: User;
  token: string;
}

export enum AuthStatus {
  checking = 'checking',
  authentication = 'autentication',
  nonAuthenticacion = 'nonAutenticacion',
}
