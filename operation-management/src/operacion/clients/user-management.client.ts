import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

type ComunidadRecord = {
  id: number;
  personas: number[];
  personasInactivas: number[];
};

@Injectable()
export class UserManagementClient {
  private readonly baseUrl = (
    process.env.USER_MANAGEMENT_URL ?? 'http://localhost:3002'
  ).replace(/\/$/, '');

  async assertActiveCommunityMembers(personaIds: number[], comunidadId: number): Promise<void> {
    const uniquePersonaIds = [...new Set(personaIds)];
    const personas = await Promise.all(
      uniquePersonaIds.map(async (personaId) => {
        const response = await this.request(`/persona/${personaId}`);
        if (response.status === 404) {
          throw new NotFoundException(`Persona con id ${personaId} no encontrada`);
        }
        if (!response.ok) {
          throw new ServiceUnavailableException('No se pudo consultar el Servicio III');
        }
        return response.json() as Promise<{ id: number }>;
      }),
    );

    const comunidadResponse = await this.request(`/comunidad/${comunidadId}`);
    if (comunidadResponse.status === 404) {
      throw new NotFoundException(`Comunidad con id ${comunidadId} no encontrada`);
    }
    if (!comunidadResponse.ok) {
      throw new ServiceUnavailableException('No se pudo consultar el Servicio III');
    }
    const comunidad = (await comunidadResponse.json()) as ComunidadRecord;

    for (const persona of personas) {
      if (!comunidad.personas.includes(persona.id)) {
        if (comunidad.personasInactivas.includes(persona.id)) {
          throw new BadRequestException(
            `La persona ${persona.id} no está activa en la comunidad ${comunidadId}`,
          );
        }
        throw new BadRequestException(
          `La persona ${persona.id} no pertenece a la comunidad ${comunidadId}`,
        );
      }
    }
  }

  private async request(path: string): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}${path}`);
    } catch {
      throw new ServiceUnavailableException('El Servicio III no está disponible');
    }
  }
}