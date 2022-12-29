import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IEvento } from '../models/IEvento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  // providers: [EventoService],
})
export class EventosComponent implements OnInit {
  public modalRef?: BsModalRef;

  public eventos: IEvento[] = [];
  public eventosFiltrados: IEvento[] = [];

  public larguraImg = 150;
  public margemImg = 2;
  public exibirImg = false;
  private filtroListado = '';

  public get filtroLista() {
    return this.filtroListado;
  }

  public set filtroLista(valor: string) {
    this.filtroListado = valor;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): IEvento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
  ) {}

  public ngOnInit(): void {
    this.getEventos();
  }

  public alterarImg() {
    this.exibirImg = !this.exibirImg;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe(
      (eventos: IEvento[]) => {
        (this.eventos = eventos), (this.eventosFiltrados = eventos);
      },
      (error) => console.log(error)
    );
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
