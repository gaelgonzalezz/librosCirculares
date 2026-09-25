export declare class CreatePersonaDto {
    nombre: string;
    apellido: string;
    dni: string;
    personaContactoId?: number;
    listaMedioContactos?: {
        tipo: string;
        valor: string;
        esPreferido: boolean;
    }[];
}
