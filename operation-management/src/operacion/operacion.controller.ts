import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OperacionService } from './operacion.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { CreateCesionDto } from './dto/create-cesion.dto';
import { CreateBajaDto } from './dto/create-baja.dto';

@Controller()
export class OperacionController {
  constructor(private readonly operacionService: OperacionService) {}

  @Post('operaciones/prestamo')
  createPrestamo(@Body() dto: CreatePrestamoDto) {
    return this.operacionService.registrarPrestamo(dto);
  }

  @Post('operaciones/devolucion')
  createDevolucion(@Body() dto: CreateDevolucionDto) {
    return this.operacionService.registrarDevolucion(dto);
  }

  @Post('operaciones/cesion')
  createCesion(@Body() dto: CreateCesionDto) {
    return this.operacionService.registrarCesion(dto);
  }

  @Post('operaciones/baja')
  createBaja(@Body() dto: CreateBajaDto) {
    return this.operacionService.registrarBaja(dto);
  }

  @Get('operaciones')
  findAll(
    @Query('ejemplarId') ejemplarId?: string,
    @Query('personaId') personaId?: string,
    @Query('tipo') tipo?: string,
    @Query('estado') estado?: string,
  ) {
    return this.operacionService.findAll({
      ejemplarId: ejemplarId ? +ejemplarId : undefined,
      personaId: personaId ? +personaId : undefined,
      tipo: tipo as any,
      estado: estado as any,
    });
  }

  @Get('operaciones/:id')
  findOne(@Param('id') id: string) {
    return this.operacionService.findOne(+id);
  }

  @Get('personas/:id/operaciones')
  consultarPersonas(
    @Param('id') id: string,
    @Query('idComunidad') idComunidad?: string,
  ) {
    return this.operacionService.consultarPersona(+id, +idComunidad!);
  }
}
