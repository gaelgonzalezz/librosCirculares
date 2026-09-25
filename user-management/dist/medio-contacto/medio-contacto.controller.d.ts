import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';
import { MedioContactoService } from './medio-contacto.service';
export declare class MedioContactoController {
    private readonly medioContactoService;
    constructor(medioContactoService: MedioContactoService);
    create(dto: CreateMedioContactoDto): import("./entities/medio-contacto.entity").MedioContacto;
    findAll(): import("./entities/medio-contacto.entity").MedioContacto[];
    findOne(id: string): import("./entities/medio-contacto.entity").MedioContacto;
    update(id: string, dto: UpdateMedioContactoDto): import("./entities/medio-contacto.entity").MedioContacto;
    remove(id: string): boolean;
}
