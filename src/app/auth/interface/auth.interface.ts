export interface AuthResponse {
  ok: boolean;
  id_profesional: string;
  role: string;
  user: string;
  password: string;
  state: boolean;
  token: string;
}

export interface User {
  id: string;
  role: string;
  user: string;
}

export interface UpdateToken {
  ok: boolean;
  id_profesional: string;
  role: string;
  user: string;
  password: string;
  token: string;
}
