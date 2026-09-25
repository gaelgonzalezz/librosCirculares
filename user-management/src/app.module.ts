import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonaModule } from './persona/persona.module';
import { ComunidadModule } from './comunidad/comunidad.module';
import { MedioContactoModule } from './medio-contacto/medio-contacto.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'user-management',
    }),
    PersonaModule,
    ComunidadModule,
    MedioContactoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
