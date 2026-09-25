import { PersonaService } from '../persona/persona.service';
import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';
export declare class MedioContactoService {
    private readonly personaService;
    constructor(personaService: PersonaService);
    create(createMedioContactoDto: CreateMedioContactoDto): import("./entities/medio-contacto.entity").MedioContacto;
    findAll(): import("./entities/medio-contacto.entity").MedioContacto[];
    findOne(id: number): import("./entities/medio-contacto.entity").MedioContacto;
    update(id: number, updateMedioContactoDto: UpdateMedioContactoDto): import("./entities/medio-contacto.entity").MedioContacto;
    remove(id: number): boolean;
}
