import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';
import { MedioContacto } from './entities/medio-contacto.entity';
import { Persona } from '../persona/entities/persona.entity';
import { PersonaService } from '../persona/persona.service';
export declare class MedioContactoService {
    private readonly personaService;
    constructor(personaService: PersonaService);
    medios: MedioContacto[];
    siguienteId(): number;
    coincideConExistente(tipo: string, valor: string, personaId: number): boolean;
    createForPersona(persona: Persona, datos: {
        tipo: string;
        valor: string;
        esPreferido: boolean;
    }): MedioContacto;
    create(createMedioContactoDto: CreateMedioContactoDto): number;
    findAll(): MedioContacto[];
    findOne(id: number): MedioContacto;
    update(id: number, updateMedioContactoDto: UpdateMedioContactoDto): void;
    remove(id: number): boolean;
}
