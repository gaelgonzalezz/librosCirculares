import { Persona } from '../../persona/entities/persona.entity';
export declare class Comunidad {
    id: number;
    nombre: string;
    personas: Persona[];
    idsPersonasInactivas: number[];
}
