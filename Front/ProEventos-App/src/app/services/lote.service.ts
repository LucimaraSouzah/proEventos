import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILote } from '@app/models/ILote';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class LoteService {
  baseUrl = 'http://localhost:5041/api/lotes';

  constructor(private http: HttpClient) {}

  public getLotesByEventoId(eventoId: number): Observable<ILote[]> {
    return this.http.get<ILote[]>(`${this.baseUrl}/${eventoId}`).pipe(take(1));
  }

  public saveLote(eventoId: number, lotes: ILote[]): Observable<ILote[]> {
    return this.http
      .put<ILote[]>(`${this.baseUrl}/${eventoId}`, lotes)
      .pipe(take(1));
  }

  public deleteLote(eventoId: number, loteId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${eventoId}/${loteId}`)
      .pipe(take(1));
  }
}
