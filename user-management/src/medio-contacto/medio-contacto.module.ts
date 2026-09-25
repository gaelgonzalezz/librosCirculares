import { Module } from '@nestjs/common';
import { PersonaModule } from '../persona/persona.module';
import { MedioContactoController } from './medio-contacto.controller';
import { MedioContactoService } from './medio-contacto.service';

@Module({
  imports: [PersonaModule],
  controllers: [MedioContactoController],
  providers: [MedioContactoService],
})
export class MedioContactoModule {}
