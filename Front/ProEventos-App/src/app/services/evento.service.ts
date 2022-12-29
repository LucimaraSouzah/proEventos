import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvento } from '../models/IEvento';

@Injectable()
//{ providedIn : 'root' }
export class EventoService {
  baseUrl = 'http://localhost:5041/api/eventos';
  constructor(private http: HttpClient) {}

  public getEventos(): Observable<IEvento[]> {
    return this.http.get<IEvento[]>(this.baseUrl);
  }

  public getEventosByTema(tema: string): Observable<IEvento[]> {
    return this.http.get<IEvento[]>(`${this.baseUrl}/${tema}/tema`);
  }

  public getEventoById(id: number): Observable<IEvento> {
    return this.http.get<IEvento>(`${this.baseUrl}/${id}`);
  }
}
