import { Module } from '@nestjs/common';
import { ComunidadController } from './comunidad.controller';
import { ComunidadService } from './comunidad.service';
import { PersonaModule } from '../persona/persona.module';

@Module({
  imports: [PersonaModule],
  controllers: [ComunidadController],
  providers: [ComunidadService],
  exports: [ComunidadService],
})
export class ComunidadModule {}
