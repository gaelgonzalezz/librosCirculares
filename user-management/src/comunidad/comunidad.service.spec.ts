import { Test, TestingModule } from '@nestjs/testing';
import { ComunidadService } from './comunidad.service';
import { PersonaService } from '../persona/persona.service';

describe('ComunidadService', () => {
  let service: ComunidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunidadService, PersonaService],
    }).compile();

    service = module.get<ComunidadService>(ComunidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
