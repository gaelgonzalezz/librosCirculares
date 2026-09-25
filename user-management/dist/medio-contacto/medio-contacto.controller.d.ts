import { MedioContactoService } from './medio-contacto.service';
import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';
export declare class MedioContactoController {
    private readonly medioContactoService;
    constructor(medioContactoService: MedioContactoService);
    create(createMedioContactoDto: CreateMedioContactoDto): number;
    findAll(): import("./entities/medio-contacto.entity").MedioContacto[];
    findOne(id: string): import("./entities/medio-contacto.entity").MedioContacto;
    update(id: string, updateMedioContactoDto: UpdateMedioContactoDto): void;
    remove(id: string): boolean;
}
