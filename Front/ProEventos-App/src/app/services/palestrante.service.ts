import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPalestrante } from '@app/models/IPalestrante';
import { PaginatedResult } from '@app/models/Pagination';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PalestranteService {
  baseUrl = environment.apiURL + 'api/Palestrante';

  constructor(private http: HttpClient) {}

  public getPalestrantes(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<IPalestrante[]>> {
    const paginatedResult: PaginatedResult<IPalestrante[]> =
      new PaginatedResult<IPalestrante[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '') {
      params = params.append('term', term);
    }

    return this.http
      .get<IPalestrante[]>(this.baseUrl + '/all', {
        observe: 'response',
        params,
      })
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

  public getPalestrante(): Observable<IPalestrante> {
    return this.http.get<IPalestrante>(`${this.baseUrl}`).pipe(take(1));
  }

  public post(): Observable<IPalestrante> {
    return this.http
      .post<IPalestrante>(this.baseUrl, {} as IPalestrante)
      .pipe(take(1));
  }

  public put(palestrante: IPalestrante): Observable<IPalestrante> {
    return this.http
      .put<IPalestrante>(`${this.baseUrl}`, palestrante)
      .pipe(take(1));
  }
}
