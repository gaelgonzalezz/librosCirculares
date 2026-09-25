import { MedioContacto } from '../../medio-contacto/entities/medio-contacto.entity';

export class Persona {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  personaContacto?: number;
  listaMedioContactos: MedioContacto[];
  comunidades: number[];
}
