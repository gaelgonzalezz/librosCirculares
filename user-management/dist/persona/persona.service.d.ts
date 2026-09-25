import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { MedioContactoService } from '../medio-contacto/medio-contacto.service';
import { ComunidadService } from '../comunidad/comunidad.service';
export declare class PersonaService {
    private readonly medioContactoService;
    private readonly comunidadService;
    constructor(medioContactoService: MedioContactoService, comunidadService: ComunidadService);
    personas: Persona[];
    siguienteId(): number;
    create(createPersonaDto: CreatePersonaDto): number;
    findAll(): Persona[];
    findOne(id: number): Persona;
    update(id: number, updatePersonaDto: UpdatePersonaDto): void;
    remove(id: number): boolean;
}
