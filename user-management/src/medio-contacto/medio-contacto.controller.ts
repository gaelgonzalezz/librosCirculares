import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMedioContactoDto } from './dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from './dto/update-medio-contacto.dto';
import { MedioContactoService } from './medio-contacto.service';

@Controller('medioContacto')
export class MedioContactoController {
  constructor(private readonly medioContactoService: MedioContactoService) {}

  @Post()
  create(@Body() dto: CreateMedioContactoDto) {
    return this.medioContactoService.create(dto);
  }

  @Get()
  findAll() {
    return this.medioContactoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medioContactoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedioContactoDto) {
    return this.medioContactoService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medioContactoService.remove(+id);
  }
}
