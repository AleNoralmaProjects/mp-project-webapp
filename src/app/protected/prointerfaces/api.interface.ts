export interface Profesional {
  id_profesional: string;
  role: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  user: string;
  state: boolean;
  profesion: Profesion;
  brigadaEai: BrigadaEAIS[];
}

export interface UpdateProfesional {
  state: boolean;
}

export interface Profesion {
  id_profesion: string;
  descripcion: string;
}

export interface BrigadaEAIS {
  id_brigadaeais: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  state: boolean;
  profesional: Profesional;
  eais: InfoEais;
}

export interface UpdateBrigadaEais {
  fecha_actualizacion: string;
  state: boolean;
}

export interface InfoEais {
  id_eais: string;
  cod_eais: string;
  parroquia: string;
  canton: string;
  provincia: string;
  distrito: string;
  zona: string;
}
