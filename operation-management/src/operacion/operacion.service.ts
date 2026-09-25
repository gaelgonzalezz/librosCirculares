import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class OperacionService {
  private operaciones: Operacion[] = [];
  private nextId = 1;

  registrarPrestamo(dto: CreatePrestamoDto) {
    if (
      !dto.ejemplarId ||
      !dto.comunidadId ||
      !dto.personaPrestamistaId ||
      !dto.personaReceptoraId
    ) {
      throw new BadRequestException('Faltan datos requeridos para registrar el préstamo');
    }

    if (dto.personaPrestamistaId === dto.personaReceptoraId) {
      throw new BadRequestException('El prestatario es la misma persona');
    }

    const prestamoAbierto = this.operaciones.find(
      (op) =>
        op.tipo === 'PRESTAMO' &&
        op.ejemplarId === dto.ejemplarId &&
        op.estado === 'ABIERTA',
    );

    if (prestamoAbierto) {
      throw new ConflictException('El ejemplar ya tiene un préstamo abierto');
    }

    const nuevaOperacion: Operacion = {
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

  registrarDevolucion(dto: CreateDevolucionDto) {
    if (!dto.ejemplarId || !dto.comunidadId) {
      throw new BadRequestException('Faltan datos requeridos para registrar la devolución');
    }

    const prestamoAbierto = this.operaciones.find(
      (op) =>
        op.tipo === 'PRESTAMO' &&
        op.ejemplarId === dto.ejemplarId &&
        op.estado === 'ABIERTA' &&
        op.comunidadId === dto.comunidadId,
    );

    if (!prestamoAbierto) {
      throw new NotFoundException('No existe un préstamo activo para ese ejemplar');
    }

    prestamoAbierto.estado = 'CERRADA';
    prestamoAbierto.fechaFin = new Date().toISOString();

    const devolucion: Operacion = {
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

  registrarCesion(dto: CreateCesionDto) {
    if (
      !dto.ejemplarId ||
      !dto.comunidadId ||
      !dto.duenoActualId ||
      !dto.nuevoDuenoId
    ) {
      throw new BadRequestException('Faltan datos requeridos para registrar la cesión');
    }

    if (dto.duenoActualId === dto.nuevoDuenoId) {
      throw new BadRequestException('El nuevo dueño es igual al actual');
    }

    const nuevaOperacion: Operacion = {
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

  registrarBaja(dto: CreateBajaDto) {
    if (!dto.ejemplarId || !dto.comunidadId || !dto.propietarioId) {
      throw new BadRequestException('Faltan datos requeridos para registrar la baja');
    }

    const prestamoAbierto = this.operaciones.find(
      (op) =>
        op.tipo === 'PRESTAMO' &&
        op.ejemplarId === dto.ejemplarId &&
        op.estado === 'ABIERTA',
    );

    if (prestamoAbierto) {
      throw new ConflictException('El ejemplar tiene un préstamo abierto; debe devolverse antes de darlo de baja');
    }

    const baja: Operacion = {
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

  findAll(filters?: {
    ejemplarId?: number;
    personaId?: number;
    tipo?: TipoOperacion;
    estado?: EstadoOperacion;
  }) {
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

  findOne(id: number) {
    const operacion = this.operaciones.find((item) => item.id === id);

    if (!operacion) {
      throw new NotFoundException(`Operación con id ${id} no encontrada`);
    }

    return operacion;
  }

  consultarPersona(id: number, comunidadId: number): PersonaOperacionesAbiertasResponse {
    if (!comunidadId) {
      throw new BadRequestException('Falta el parámetro idComunidad');
    }

    const abiertas = this.operaciones.filter(
      (operacion) =>
        operacion.comunidadId === comunidadId &&
        operacion.estado === 'ABIERTA' &&
        (operacion.personaOrigenId === id || operacion.personaDestinoId === id),
    );

    const totalCerradas = this.operaciones.filter(
      (operacion) =>
        operacion.comunidadId === comunidadId &&
        (operacion.personaOrigenId === id || operacion.personaDestinoId === id) &&
        operacion.estado === 'CERRADA',
    ).length;

    return {
      personaId: id,
      comunidadId,
      tieneOperacionesAbiertas: abiertas.length > 0,
      operacionesAbiertas: abiertas,
      totalCerradas: totalCerradas,
    };
  }
}
