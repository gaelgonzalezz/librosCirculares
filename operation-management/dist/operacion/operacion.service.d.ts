import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { CreateCesionDto } from './dto/create-cesion.dto';
import { CreateBajaDto } from './dto/create-baja.dto';
import { EstadoOperacion, Operacion, TipoOperacion } from './entities/operacion.entity';
type PersonaOperacionesAbiertasResponse = {
    personaId: number;
    comunidadId: number;
    tieneOperacionesAbiertas: boolean;
    operacionesAbiertas: Operacion[];
    totalCerradas: number;
};
export declare class OperacionService {
    private operaciones;
    private nextId;
    registrarPrestamo(dto: CreatePrestamoDto): {
        id: number;
        mensaje: string;
    };
    registrarDevolucion(dto: CreateDevolucionDto): {
        id: number;
        mensaje: string;
    };
    registrarCesion(dto: CreateCesionDto): {
        id: number;
        mensaje: string;
    };
    registrarBaja(dto: CreateBajaDto): {
        id: number;
        mensaje: string;
    };
    findAll(filters?: {
        ejemplarId?: number;
        personaId?: number;
        tipo?: TipoOperacion;
        estado?: EstadoOperacion;
    }): Operacion[];
    findOne(id: number): Operacion;
    consultarPersona(id: number, comunidadId: number): PersonaOperacionesAbiertasResponse;
}
export {};
