import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { CreateCesionDto } from './dto/create-cesion.dto';
import { CreateBajaDto } from './dto/create-baja.dto';
import { EstadoOperacion, Operacion, TipoOperacion } from './entities/operacion.entity';
import { CopyManagementClient, CopyRecord } from './clients/copy-management.client';
import { UserManagementClient } from './clients/user-management.client';

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

  constructor(
    private readonly copyManagementClient: CopyManagementClient,
    private readonly userManagementClient: UserManagementClient,
  ) {}

  async registrarPrestamo(dto: CreatePrestamoDto) {
    this.assertPositiveIds(
      [dto.ejemplarId, dto.comunidadId, dto.personaPrestamistaId, dto.personaReceptoraId],
      'Faltan datos requeridos para registrar el préstamo',
    );

    if (dto.personaPrestamistaId === dto.personaReceptoraId) {
      throw new BadRequestException('El prestatario es la misma persona');
    }

    const copy = await this.copyManagementClient.findCopy(dto.ejemplarId);
    this.assertCopyActive(copy);
    await this.userManagementClient.assertActiveCommunityMembers(
      [dto.personaPrestamistaId, dto.personaReceptoraId],
      dto.comunidadId,
    );

    if (copy.inPosessionId !== dto.personaPrestamistaId) {
      throw new ConflictException('Quien presta no tiene el ejemplar en su poder actualmente');
    }

    const prestamoAbierto = this.operaciones.find(
      (op) =>
        op.tipo === 'PRESTAMO' &&
        op.ejemplarId === dto.ejemplarId &&
        op.estado === 'ABIERTA',
    );

    if (
      prestamoAbierto &&
      (prestamoAbierto.personaDestinoId !== dto.personaPrestamistaId ||
        prestamoAbierto.comunidadId !== dto.comunidadId)
    ) {
      throw new ConflictException('El ejemplar ya tiene un préstamo abierto incompatible');
    }

    await this.copyManagementClient.updateCopy(dto.ejemplarId, {
      inPosessionId: dto.personaReceptoraId,
    });

    if (prestamoAbierto) {
      prestamoAbierto.estado = 'CERRADA';
      prestamoAbierto.fechaFin = new Date().toISOString();
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

  async registrarDevolucion(dto: CreateDevolucionDto) {
    this.assertPositiveIds(
      [dto.ejemplarId, dto.comunidadId],
      'Faltan datos requeridos para registrar la devolución',
    );

    const copy = await this.copyManagementClient.findCopy(dto.ejemplarId);
    this.assertCopyActive(copy);

    const prestamoAbierto = this.operaciones.find(
      (op) =>
        op.tipo === 'PRESTAMO' &&
        op.ejemplarId === dto.ejemplarId &&
        op.estado === 'ABIERTA' &&
        op.comunidadId === dto.comunidadId,
    );

    if (!prestamoAbierto) {
      throw new ConflictException('No existe un préstamo activo para ese ejemplar');
    }
    if (prestamoAbierto.comunidadId !== dto.comunidadId) {
      throw new BadRequestException('El préstamo pertenece a otra comunidad');
    }
    if (copy.inPosessionId !== prestamoAbierto.personaDestinoId) {
      throw new ConflictException('La posesión actual no coincide con el préstamo abierto');
    }

    const fechaFin = new Date().toISOString();
    await this.copyManagementClient.updateCopy(dto.ejemplarId, {
      inPosessionId: copy.ownerId,
    });

    prestamoAbierto.estado = 'CERRADA';
    prestamoAbierto.fechaFin = fechaFin;

    const devolucion: Operacion = {
      id: this.nextId++,
      tipo: 'DEVOLUCION',
      ejemplarId: dto.ejemplarId,
      comunidadId: dto.comunidadId,
      personaOrigenId: prestamoAbierto.personaDestinoId ?? prestamoAbierto.personaOrigenId,
      personaDestinoId: prestamoAbierto.personaOrigenId,
      fechaInicio: fechaFin,
      fechaFin,
      estado: 'CERRADA',
    };

    this.operaciones.push(devolucion);

    return {
      id: devolucion.id,
      mensaje: 'Devolución registrada exitosamente. El ejemplar regresó al propietario',
    };
  }

  async registrarCesion(dto: CreateCesionDto) {
    this.assertPositiveIds(
      [dto.ejemplarId, dto.comunidadId, dto.duenoActualId, dto.nuevoDuenoId],
      'Faltan datos requeridos para registrar la cesión',
    );

    if (dto.duenoActualId === dto.nuevoDuenoId) {
      throw new BadRequestException('El nuevo dueño es igual al actual');
    }

    const copy = await this.copyManagementClient.findCopy(dto.ejemplarId);
    this.assertCopyActive(copy);
    await this.userManagementClient.assertActiveCommunityMembers(
      [dto.duenoActualId, dto.nuevoDuenoId],
      dto.comunidadId,
    );
    if (copy.ownerId !== dto.duenoActualId) {
      throw new ConflictException('Quien solicita la cesión no es el propietario actual');
    }

    const fecha = new Date().toISOString();
    await this.copyManagementClient.updateCopy(dto.ejemplarId, {
      ownerId: dto.nuevoDuenoId,
    });

    const nuevaOperacion: Operacion = {
      id: this.nextId++,
      tipo: 'CESION',
      ejemplarId: dto.ejemplarId,
      comunidadId: dto.comunidadId,
      personaOrigenId: dto.duenoActualId,
      personaDestinoId: dto.nuevoDuenoId,
      fechaInicio: fecha,
      fechaFin: fecha,
      estado: 'CERRADA',
    };

    this.operaciones.push(nuevaOperacion);

    return {
      id: nuevaOperacion.id,
      mensaje: 'Cesión de propiedad completada exitosamente',
    };
  }

  async registrarBaja(dto: CreateBajaDto) {
    this.assertPositiveIds(
      [dto.ejemplarId, dto.comunidadId, dto.propietarioId],
      'Faltan datos requeridos para registrar la baja',
    );

    const copy = await this.copyManagementClient.findCopy(dto.ejemplarId);
    this.assertCopyActive(copy);
    await this.userManagementClient.assertActiveCommunityMembers(
      [dto.propietarioId],
      dto.comunidadId,
    );
    if (copy.ownerId !== dto.propietarioId) {
      throw new ConflictException('Quien solicita la baja no es el propietario actual');
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

    const fecha = new Date().toISOString();
    await this.copyManagementClient.updateCopy(dto.ejemplarId, { active: false });

    const baja: Operacion = {
      id: this.nextId++,
      tipo: 'BAJA',
      ejemplarId: dto.ejemplarId,
      comunidadId: dto.comunidadId,
      personaOrigenId: dto.propietarioId,
      fechaInicio: fecha,
      fechaFin: fecha,
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

    return {
      ...operacion,
      personaDestinoId: operacion.personaDestinoId ?? 'Sin Valor',
      fechaFin: operacion.fechaFin ?? 'Sin Valor',
      motivo: operacion.motivo ?? 'Sin Valor',
    };
  }

  consultarPersona(id: number, comunidadId: number): PersonaOperacionesAbiertasResponse {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('El id de persona debe ser un entero positivo');
    }
    if (!Number.isInteger(comunidadId) || comunidadId <= 0) {
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

  private assertPositiveIds(ids: number[], message: string): void {
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new BadRequestException(message);
    }
  }

  private assertCopyActive(copy: CopyRecord): void {
    if (copy.active === false) {
      throw new ConflictException('El ejemplar está dado de baja');
    }
  }
}
