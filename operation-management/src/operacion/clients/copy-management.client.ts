import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

export type CopyRecord = {
  id: number;
  ownerId: number;
  inPosessionId: number;
  active?: boolean;
};

@Injectable()
export class CopyManagementClient {
  private readonly baseUrl = (
    process.env.COPY_MANAGEMENT_URL ?? 'http://localhost:3001'
  ).replace(/\/$/, '');

  async findCopy(id: number): Promise<CopyRecord> {
    const response = await this.request(`/copy/${id}`);
    if (response.status === 404) {
      throw new NotFoundException(`Ejemplar con id ${id} no encontrado`);
    }
    if (!response.ok) {
      throw new ServiceUnavailableException('No se pudo consultar el Servicio I');
    }
    return response.json() as Promise<CopyRecord>;
  }

  async updateCopy(id: number, changes: Partial<CopyRecord>): Promise<void> {
    const response = await this.request(`/copy/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    if (response.status === 404) {
      throw new NotFoundException(`Ejemplar con id ${id} no encontrado`);
    }
    if (!response.ok) {
      throw new ServiceUnavailableException('No se pudo actualizar el ejemplar en el Servicio I');
    }
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}${path}`, init);
    } catch {
      throw new ServiceUnavailableException('El Servicio I no está disponible');
    }
  }
}