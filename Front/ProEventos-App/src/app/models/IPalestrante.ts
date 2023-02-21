import { UserUpdate } from '@app/models/identity/UserUpdate';
import { IEvento } from "./IEvento";
import { IRedeSocial } from "./IRedeSocial";

export interface IPalestrante {
  id: number;
  miniCurriculo: string;
  user: UserUpdate;
  redesSociais: IRedeSocial[]
  palestrantesEventos: IEvento[]
}
