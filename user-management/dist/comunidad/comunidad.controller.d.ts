import { ComunidadService } from './comunidad.service';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
export declare class ComunidadController {
    private readonly comunidadService;
    constructor(comunidadService: ComunidadService);
    create(createComunidadDto: CreateComunidadDto): number;
    findAll(): import("./entities/comunidad.entity").Comunidad[];
    findOne(id: string): import("./entities/comunidad.entity").Comunidad;
    update(id: string, updateComunidadDto: UpdateComunidadDto): void;
    remove(id: string): boolean;
    altaPersona(id: string, personaId: string): Promise<void>;
    desactivarPersona(id: string, personaId: string): Promise<boolean>;
    bajaPersona(id: string, personaId: string): Promise<boolean>;
}
