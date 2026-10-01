"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperacionService = void 0;
const common_1 = require("@nestjs/common");
const servicio_clients_service_1 = require("./servicio-clients.service");
let OperacionService = class OperacionService {
    servicios;
    operaciones = [];
    nextId = 1;
    constructor(servicios) {
        this.servicios = servicios;
    }
    async registrarPrestamo(dto) {
        this.validarIds(dto.ejemplarId, dto.comunidadId, dto.personaPrestamistaId, dto.personaReceptoraId);
        if (dto.personaPrestamistaId === dto.personaReceptoraId) {
            throw new common_1.BadRequestException('El prestatario es la misma persona');
        }
        await this.servicios.validarPersonasEnComunidad(dto.comunidadId, [
            dto.personaPrestamistaId,
            dto.personaReceptoraId,
        ]);
        const ejemplar = await this.servicios.obtenerEjemplar(dto.ejemplarId);
        this.validarEjemplarActivo(ejemplar);
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA');
        if (ejemplar.inPosessionId !== dto.personaPrestamistaId) {
            throw new common_1.ConflictException('Quien presta no tiene el ejemplar en su poder actualmente');
        }
        if (prestamoAbierto && prestamoAbierto.personaDestinoId !== dto.personaPrestamistaId) {
            throw new common_1.ConflictException('El ejemplar ya tiene un préstamo abierto no encadenable');
        }
        const ahora = new Date().toISOString();
        await this.servicios.actualizarEjemplar(dto.ejemplarId, {
            inPosessionId: dto.personaReceptoraId,
        });
        if (prestamoAbierto) {
            prestamoAbierto.estado = 'CERRADA';
            prestamoAbierto.fechaFin = ahora;
        }
        const nuevaOperacion = {
            id: this.nextId++,
            tipo: 'PRESTAMO',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.personaPrestamistaId,
            personaDestinoId: dto.personaReceptoraId,
            fechaInicio: ahora,
            estado: 'ABIERTA',
        };
        this.operaciones.push(nuevaOperacion);
        return {
            id: nuevaOperacion.id,
            mensaje: 'Préstamo registrado exitosamente',
        };
    }
    async registrarDevolucion(dto) {
        this.validarIds(dto.ejemplarId, dto.comunidadId);
        const ejemplar = await this.servicios.obtenerEjemplar(dto.ejemplarId);
        this.validarEjemplarActivo(ejemplar);
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA' &&
            op.comunidadId === dto.comunidadId);
        if (!prestamoAbierto) {
            throw new common_1.ConflictException('No existe un préstamo activo para ese ejemplar en la comunidad');
        }
        if (ejemplar.inPosessionId !== prestamoAbierto.personaDestinoId) {
            throw new common_1.ConflictException('El poseedor actual no coincide con el prestatario del préstamo abierto');
        }
        await this.servicios.validarPersonasEnComunidad(dto.comunidadId, [
            ejemplar.ownerId,
            ejemplar.inPosessionId,
        ]);
        const ahora = new Date().toISOString();
        await this.servicios.actualizarEjemplar(dto.ejemplarId, {
            inPosessionId: ejemplar.ownerId,
        });
        prestamoAbierto.estado = 'CERRADA';
        prestamoAbierto.fechaFin = ahora;
        const devolucion = {
            id: this.nextId++,
            tipo: 'DEVOLUCION',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: prestamoAbierto.personaDestinoId ?? prestamoAbierto.personaOrigenId,
            personaDestinoId: ejemplar.ownerId,
            fechaInicio: ahora,
            fechaFin: ahora,
            estado: 'CERRADA',
        };
        this.operaciones.push(devolucion);
        return {
            id: devolucion.id,
            mensaje: 'Devolución registrada exitosamente. El ejemplar regresó al propietario',
        };
    }
    async registrarCesion(dto) {
        this.validarIds(dto.ejemplarId, dto.comunidadId, dto.duenoActualId, dto.nuevoDuenoId);
        if (dto.duenoActualId === dto.nuevoDuenoId) {
            throw new common_1.BadRequestException('El nuevo dueño es igual al actual');
        }
        await this.servicios.validarPersonasEnComunidad(dto.comunidadId, [
            dto.duenoActualId,
            dto.nuevoDuenoId,
        ]);
        const ejemplar = await this.servicios.obtenerEjemplar(dto.ejemplarId);
        this.validarEjemplarActivo(ejemplar);
        if (ejemplar.ownerId !== dto.duenoActualId) {
            throw new common_1.ConflictException('Quien solicita la cesión no es el propietario actual');
        }
        const ahora = new Date().toISOString();
        await this.servicios.actualizarEjemplar(dto.ejemplarId, { ownerId: dto.nuevoDuenoId });
        const nuevaOperacion = {
            id: this.nextId++,
            tipo: 'CESION',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.duenoActualId,
            personaDestinoId: dto.nuevoDuenoId,
            fechaInicio: ahora,
            fechaFin: ahora,
            estado: 'CERRADA',
        };
        this.operaciones.push(nuevaOperacion);
        return {
            id: nuevaOperacion.id,
            mensaje: 'Cesión de propiedad completada exitosamente',
        };
    }
    async registrarBaja(dto) {
        this.validarIds(dto.ejemplarId, dto.comunidadId, dto.propietarioId);
        await this.servicios.validarPersonasEnComunidad(dto.comunidadId, [dto.propietarioId]);
        const ejemplar = await this.servicios.obtenerEjemplar(dto.ejemplarId);
        this.validarEjemplarActivo(ejemplar);
        if (ejemplar.ownerId !== dto.propietarioId) {
            throw new common_1.ConflictException('Quien solicita la baja no es el propietario actual');
        }
        const prestamoAbierto = this.operaciones.find((op) => op.tipo === 'PRESTAMO' &&
            op.ejemplarId === dto.ejemplarId &&
            op.estado === 'ABIERTA');
        if (prestamoAbierto) {
            throw new common_1.ConflictException('El ejemplar tiene un préstamo abierto; debe devolverse antes de darlo de baja');
        }
        const ahora = new Date().toISOString();
        await this.servicios.actualizarEjemplar(dto.ejemplarId, { active: false });
        const baja = {
            id: this.nextId++,
            tipo: 'BAJA',
            ejemplarId: dto.ejemplarId,
            comunidadId: dto.comunidadId,
            personaOrigenId: dto.propietarioId,
            fechaInicio: ahora,
            fechaFin: ahora,
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
        this.validarIds(id);
        const operacion = this.operaciones.find((item) => item.id === id);
        if (!operacion) {
            throw new common_1.NotFoundException(`Operación con id ${id} no encontrada`);
        }
        return operacion;
    }
    consultarPersona(id, comunidadId) {
        this.validarIds(id, comunidadId);
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
    validarIds(...ids) {
        if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
            throw new common_1.BadRequestException('Los identificadores deben ser números enteros positivos');
        }
    }
    validarEjemplarActivo(ejemplar) {
        if (ejemplar.active === false || ejemplar.inactivo === true || ejemplar.dadoDeBaja === true) {
            throw new common_1.ConflictException('El ejemplar está dado de baja');
        }
    }
};
exports.OperacionService = OperacionService;
exports.OperacionService = OperacionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [servicio_clients_service_1.ServicioClientsService])
], OperacionService);
//# sourceMappingURL=operacion.service.js.map