import { OperacionService } from './operacion.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { CreateCesionDto } from './dto/create-cesion.dto';
import { CreateBajaDto } from './dto/create-baja.dto';
export declare class OperacionController {
    private readonly operacionService;
    constructor(operacionService: OperacionService);
    createPrestamo(dto: CreatePrestamoDto): {
        id: number;
        mensaje: string;
    };
    createDevolucion(dto: CreateDevolucionDto): {
        id: number;
        mensaje: string;
    };
    createCesion(dto: CreateCesionDto): {
        id: number;
        mensaje: string;
    };
    createBaja(dto: CreateBajaDto): {
        id: number;
        mensaje: string;
    };
    findAll(ejemplarId?: string, personaId?: string, tipo?: string, estado?: string): import("./entities/operacion.entity").Operacion[];
    findOne(id: string): import("./entities/operacion.entity").Operacion;
    consultarPersonas(id: string, idComunidad?: string): {
        personaId: number;
        comunidadId: number;
        tieneOperacionesAbiertas: boolean;
        operacionesAbiertas: import("./entities/operacion.entity").Operacion[];
        totalCerradas: number;
    };
}
