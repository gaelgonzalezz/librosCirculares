import { CreateMedioContactoDto } from '../../medio-contacto/dto/create-medio-contacto.dto';

export class UpdatePersonaDto {
	nombre?: string;
	apellido?: string;
	dni?: string;
	personaContacto?: number;
	listaMedioContactos?: CreateMedioContactoDto[];
}
