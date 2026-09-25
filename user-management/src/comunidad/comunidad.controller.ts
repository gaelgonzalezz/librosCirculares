import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComunidadService } from './comunidad.service';
import { CreateComunidadDto } from './dto/create-comunidad.dto';
import { UpdateComunidadDto } from './dto/update-comunidad.dto';
import { AfiliarPersonaDto } from './dto/afiliar-persona.dto';
import { BajaPersonaDto } from './dto/baja-persona.dto';

@Controller('comunidad')
export class ComunidadController {
  constructor(private readonly comunidadService: ComunidadService) {}

  @Post()
  create(@Body() dto: CreateComunidadDto) {
    return this.comunidadService.create(dto);
  }

  @Get()
  findAll() {
    return this.comunidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comunidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComunidadDto) {
    return this.comunidadService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comunidadService.remove(+id);
  }

  @Post(':id/persona')
  addPersona(@Param('id') id: string, @Body() dto: AfiliarPersonaDto) {
    return this.comunidadService.addPersona(+id, dto.personaId);
  }

  @Delete(':id/persona/:personaId')
  removePersona(
    @Param('id') id: string,
    @Param('personaId') personaId: string,
    @Body() dto: BajaPersonaDto,
  ) {
    return this.comunidadService.removePersona(+id, +personaId, dto.operacionesCerradas);
  }

  @Patch(':id/persona/:personaId/inactivar')
  deactivatePersona(
    @Param('id') id: string,
    @Param('personaId') personaId: string,
    @Body() dto: BajaPersonaDto,
  ) {
    return this.comunidadService.deactivatePersona(+id, +personaId, dto.operacionesCerradas);
  }
}
