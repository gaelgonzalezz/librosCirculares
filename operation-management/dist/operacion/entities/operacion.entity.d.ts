export type TipoOperacion = 'PRESTAMO' | 'DEVOLUCION' | 'CESION' | 'BAJA';
export type EstadoOperacion = 'ABIERTA' | 'CERRADA';
export declare class Operacion {
    id: number;
    tipo: TipoOperacion;
    ejemplarId: number;
    comunidadId: number;
    personaOrigenId: number;
    personaDestinoId?: number;
    fechaInicio: string;
    fechaFin?: string;
    estado: EstadoOperacion;
    motivo?: string;
}
