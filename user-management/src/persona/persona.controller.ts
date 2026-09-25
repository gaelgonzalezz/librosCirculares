import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateMedioContactoDto } from '../medio-contacto/dto/create-medio-contacto.dto';
import { UpdateMedioContactoDto } from '../medio-contacto/dto/update-medio-contacto.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PersonaService } from './persona.service';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post()
  create(@Body() createPersonaDto: CreatePersonaDto) {
    return this.personaService.create(createPersonaDto);
  }

  @Get()
  findAll() {
    return this.personaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }

  @Get(':id/contacto')
  findContacts(@Param('id') id: string) {
    return this.personaService.findContacts(+id);
  }

  @Post(':id/contacto')
  addContact(@Param('id') id: string, @Body() dto: CreateMedioContactoDto) {
    return this.personaService.addContact(+id, dto);
  }

  @Patch(':id/contacto/:contactId')
  updateContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
    @Body() dto: UpdateMedioContactoDto,
  ) {
    return this.personaService.updateContact(+id, +contactId, dto);
  }

  @Delete(':id/contacto/:contactId')
  removeContact(@Param('id') id: string, @Param('contactId') contactId: string) {
    return this.personaService.removeContact(+id, +contactId);
  }
}
