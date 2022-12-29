import { ILote } from './ILote';
import { IPalestrante } from './IPalestrante';
import { IRedeSocial } from './IRedeSocial';

export interface IEvento {
  id: number;

  local: string;

  dataEvento?: Date;

  tema: string;

  qtdPessoas: number;

  imagemURL: string;

  telefone: string;

  email: string;

  lotes: ILote[];

  redesSociais: IRedeSocial[];

  palestrantesEventos: IPalestrante[];
}
