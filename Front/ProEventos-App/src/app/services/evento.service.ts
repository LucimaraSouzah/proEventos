import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvento } from '../models/IEvento';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable()
//{ providedIn : 'root' }
export class EventoService {
  baseUrl = environment.apiURL + 'api/eventos';

  constructor(private http: HttpClient) {}

  public getEventos(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<IEvento[]>> {
    const paginatedResult: PaginatedResult<IEvento[]> = new PaginatedResult<
      IEvento[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '') {
      params = params.append('term', term);
    }

    return this.http
      .get<IEvento[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
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

  postUpload(eventoId: number, file: File): Observable<IEvento> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();

    formData.append('file', fileToUpload);

    return this.http
      .post<IEvento>(`${this.baseUrl}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }
}
