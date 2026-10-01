import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { CreateCesionDto } from './dto/create-cesion.dto';
import { CreateBajaDto } from './dto/create-baja.dto';
import { EstadoOperacion, Operacion, TipoOperacion } from './entities/operacion.entity';
import { ServicioClientsService } from './servicio-clients.service';
type PersonaOperacionesAbiertasResponse = {
    personaId: number;
    comunidadId: number;
    tieneOperacionesAbiertas: boolean;
    operacionesAbiertas: Operacion[];
    totalCerradas: number;
};
export declare class OperacionService {
    private readonly servicios;
    private operaciones;
    private nextId;
    constructor(servicios: ServicioClientsService);
    registrarPrestamo(dto: CreatePrestamoDto): Promise<{
        id: number;
        mensaje: string;
    }>;
    registrarDevolucion(dto: CreateDevolucionDto): Promise<{
        id: number;
        mensaje: string;
    }>;
    registrarCesion(dto: CreateCesionDto): Promise<{
        id: number;
        mensaje: string;
    }>;
    registrarBaja(dto: CreateBajaDto): Promise<{
        id: number;
        mensaje: string;
    }>;
    findAll(filters?: {
        ejemplarId?: number;
        personaId?: number;
        tipo?: TipoOperacion;
        estado?: EstadoOperacion;
    }): Operacion[];
    findOne(id: number): Operacion;
    consultarPersona(id: number, comunidadId: number): PersonaOperacionesAbiertasResponse;
    private validarIds;
    private validarEjemplarActivo;
}
export {};
