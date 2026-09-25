"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperacionService = void 0;
const common_1 = require("@nestjs/common");
let OperacionService = class OperacionService {
    operaciones = [];
    nextId = 1;
    registrarPrestamo(dto) {
        if (!dto.ejemplarId ||
            !dto.comunidadId ||
            !dto.personaPrestamistaId ||
            !dto.personaReceptoraId) {
            throw new common_1.BadRequestException('Faltan datos requeridos para registrar el préstamo');
        }
        if (dto.personaPrestamistaId === dto.personaReceptoraId) {
            throw new common_1.BadRequestException('El prestatario es la misma persona');
        }
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA');
        if (prestamoAbierto) {
            throw new common_1.ConflictException('El ejemplar ya tiene un préstamo abierto');
        }
        const nuevaOperacion = {
            id: this.nextId++,
            tipo: 'PRESTAMO',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.personaPrestamistaId,
            personaDestinoId: dto.personaReceptoraId,
            fechaInicio: new Date().toISOString(),
            estado: 'ABIERTA',
        };
        this.operaciones.push(nuevaOperacion);
        return {
            id: nuevaOperacion.id,
            mensaje: 'Préstamo registrado exitosamente',
        };
    }
    registrarDevolucion(dto) {
        if (!dto.ejemplarId || !dto.comunidadId) {
            throw new common_1.BadRequestException('Faltan datos requeridos para registrar la devolución');
        }
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA' &&
            op.comunidadId === dto.comunidadId);
        if (!prestamoAbierto) {
            throw new common_1.NotFoundException('No existe un préstamo activo para ese ejemplar');
        }
        prestamoAbierto.estado = 'CERRADA';
        prestamoAbierto.fechaFin = new Date().toISOString();
        const devolucion = {
            id: this.nextId++,
            tipo: 'DEVOLUCION',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: prestamoAbierto.personaDestinoId ?? prestamoAbierto.personaOrigenId,
            personaDestinoId: prestamoAbierto.personaOrigenId,
            fechaInicio: new Date().toISOString(),
            fechaFin: new Date().toISOString(),
            estado: 'CERRADA',
        };
        this.operaciones.push(devolucion);
        return {
            id: devolucion.id,
            mensaje: 'Devolución registrada exitosamente. El ejemplar regresó al propietario',
        };
    }
    registrarCesion(dto) {
        if (!dto.ejemplarId ||
            !dto.comunidadId ||
            !dto.duenoActualId ||
            !dto.nuevoDuenoId) {
            throw new common_1.BadRequestException('Faltan datos requeridos para registrar la cesión');
        }
        if (dto.duenoActualId === dto.nuevoDuenoId) {
            throw new common_1.BadRequestException('El nuevo dueño es igual al actual');
        }
        const nuevaOperacion = {
            id: this.nextId++,
            tipo: 'CESION',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.duenoActualId,
            personaDestinoId: dto.nuevoDuenoId,
            fechaInicio: new Date().toISOString(),
            estado: 'CERRADA',
        };
        this.operaciones.push(nuevaOperacion);
        return {
            id: nuevaOperacion.id,
            mensaje: 'Cesión de propiedad completada exitosamente',
        };
    }
    registrarBaja(dto) {
        if (!dto.ejemplarId || !dto.comunidadId || !dto.propietarioId) {
            throw new common_1.BadRequestException('Faltan datos requeridos para registrar la baja');
        }
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA');
        if (prestamoAbierto) {
            throw new common_1.ConflictException('El ejemplar tiene un préstamo abierto; debe devolverse antes de darlo de baja');
        }
        const baja = {
            id: this.nextId++,
            tipo: 'BAJA',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.propietarioId,
            fechaInicio: new Date().toISOString(),
            fechaFin: new Date().toISOString(),
            estado: 'CERRADA',
            motivo: dto.motivo,
        };
        this.operaciones.push(baja);
        return {
            id: baja.id,
            mensaje: 'Baja del ejemplar confirmada. No se permitirán más operaciones sobre él',
        };
    }
    findAll(filters) {
        return this.operaciones.filter((operacion) => {
            const matchesEjemplar = filters?.ejemplarId ? operacion.ejemplarId === filters.ejemplarId : true;
            const matchesPersona = filters?.personaId
                ? operacion.personaOrigenId === filters.personaId || operacion.personaDestinoId === filters.personaId
                : true;
            const matchesTipo = filters?.tipo ? operacion.tipo === filters.tipo : true;
            const matchesEstado = filters?.estado ? operacion.estado === filters.estado : true;
            return matchesEjemplar && matchesPersona && matchesTipo && matchesEstado;
        });
    }
    findOne(id) {
        const operacion = this.operaciones.find((item) => item.id === id);
        if (!operacion) {
            throw new common_1.NotFoundException(`Operación con id ${id} no encontrada`);
        }
        return operacion;
    }
    consultarPersona(id, comunidadId) {
        if (!comunidadId) {
            throw new common_1.BadRequestException('Falta el parámetro idComunidad');
        }
        const abiertas = this.operaciones.filter((operacion) => operacion.comunidadId === comunidadId &&
            operacion.estado === 'ABIERTA' &&
            (operacion.personaOrigenId === id || operacion.personaDestinoId === id));
        const totalCerradas = this.operaciones.filter((operacion) => operacion.comunidadId === comunidadId &&
            (operacion.personaOrigenId === id || operacion.personaDestinoId === id) &&
            operacion.estado === 'CERRADA').length;
        return {
            personaId: id,
            comunidadId,
            tieneOperacionesAbiertas: abiertas.length > 0,
            operacionesAbiertas: abiertas,
            totalCerradas: totalCerradas,
        };
    }
};
exports.OperacionService = OperacionService;
exports.OperacionService = OperacionService = __decorate([
    (0, common_1.Injectable)()
], OperacionService);
//# sourceMappingURL=operacion.service.js.map