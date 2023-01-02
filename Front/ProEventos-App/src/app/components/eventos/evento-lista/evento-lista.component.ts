import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IEvento } from '@app/models/IEvento';
import { EventoService } from '@app/services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
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
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getEventos();

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  public alterarImg() {
    this.exibirImg = !this.exibirImg;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: IEvento[]) => {
        (this.eventos = eventos), (this.eventosFiltrados = eventos);
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error("Erro ao carregar os eventos");
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Deletado com sucesso!');
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
