import { PaginatedResult } from './../../../models/Pagination';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IEvento } from '@app/models/IEvento';
import { EventoService } from '@app/services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  public modalRef?: BsModalRef;
  public eventos: IEvento[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  public larguraImg = 150;
  public margemImg = 2;
  public exibirImg = false;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe(
              (paginatedResult: PaginatedResult<IEvento[]>) => {
                (this.eventos = paginatedResult.result),
                  (this.pagination = paginatedResult.pagination);
              },
              (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao carregar os eventos');
              }
            )
            .add(() => this.spinner.hide());
        });
      }
      this.termoBuscaChanged.next(evt.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
  }

  public alterarImg() {
    this.exibirImg = !this.exibirImg;
  }

  public mostrarImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/img/semImagem.png';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<IEvento[]>) => {
          (this.eventos = paginatedResult.result),
            (this.pagination = paginatedResult.pagination);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos');
        }
      )
      .add(() => this.spinner.hide());
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success('O evento foi deletado com sucesso');
            this.spinner.hide();
            this.carregarEventos();
          }
        },
        (error: any) => {
          console.log(error);
          this.toastr.error(`Erro ao deletar o evento ${this.eventoId}`);
          this.spinner.hide();
        }
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
