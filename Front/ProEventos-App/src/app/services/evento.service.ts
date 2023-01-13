import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvento } from '../models/IEvento';
import { take } from 'rxjs/operators';

@Injectable()
//{ providedIn : 'root' }
export class EventoService {
  baseUrl = 'http://localhost:5041/api/eventos';
  constructor(private http: HttpClient) {}

  public getEventos(): Observable<IEvento[]> {
    return this.http.get<IEvento[]>(this.baseUrl).pipe(take(1));
  }

  public getEventosByTema(tema: string): Observable<IEvento[]> {
    return this.http
      .get<IEvento[]>(`${this.baseUrl}/${tema}/tema`)
      .pipe(take(1));
  }

  public getEventoById(id: number): Observable<IEvento> {
    return this.http.get<IEvento>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public post(evento: IEvento): Observable<IEvento> {
    return this.http.post<IEvento>(this.baseUrl, evento).pipe(take(1));
  }

  public put(evento: IEvento): Observable<IEvento> {
    return this.http
      .put<IEvento>(`${this.baseUrl}/${evento.id}`, evento)
      .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(take(1));
  }
}
