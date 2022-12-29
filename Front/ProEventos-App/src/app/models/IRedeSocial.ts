import { IEvento } from './IEvento';
import { IPalestrante } from './IPalestrante';

export interface IRedeSocial {
  id: number;

  nome: string;

  URL: string;

  eventoId?: number;

  evento: IEvento;

  palestranteId?: number;

  palestrante: IPalestrante;
}
