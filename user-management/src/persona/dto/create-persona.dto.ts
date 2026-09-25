import { CreateMedioContactoDto } from '../../medio-contacto/dto/create-medio-contacto.dto';

export class CreatePersonaDto {
  nombre: string;
  apellido: string;
  dni: string;
  personaContacto?: number;
  listaMedioContactos: CreateMedioContactoDto[];
}
