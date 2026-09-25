import { MedioContacto } from '../../medio-contacto/entities/medio-contacto.entity';
export declare class Persona {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    personaContacto?: Persona;
    listaMedioContactos: MedioContacto[];
}
