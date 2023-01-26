import { environment } from './../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from './../../../services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { IEvento } from '@app/models/IEvento';
import { ILote } from './../../../models/ILote';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as IEvento;
  form: FormGroup;
  estadoSalvar = 'post';
  loteAtual = { id: 0, nome: '', indice: 0 };
  imagemURL = 'assets/img/semImagem.png';
  file: File;

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe(
          (evento: IEvento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
            // this.carregarLotes();
            if(this.evento.imagemURL !== null && this.evento.imagemURL !== '') { 
              this.imagemURL =  environment.apiURL + 'resources/images/' + this.evento.imagemURL;
            }
            this.evento.lotes.forEach((lote) => {
              this.lotes.push(this.criarLote(lote));
            });
          },
          (error: any) => {
            this.toastr.error(`Erro ao tentar carregar evento: ${error}`);
            console.log(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  // public carregarLotes(): void {
  //   this.loteService
  //     .getLotesByEventoId(this.eventoId)
  //     .subscribe(
  //       (lotesRetorno: ILote[]) => {
  //         lotesRetorno.forEach((lote) => {
  //           this.lotes.push(this.criarLote(lote));
  //         });
  //       },
  //       (error: any) => {
  //         this.toastr.error(`Erro ao tentar carregar lotes: ${error}`);
  //         console.log(error);
  //       }
  //     )
  //     .add(() => this.spinner.hide());
  // }

  ngOnInit() {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      local: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      dataEvento: ['', Validators.required],
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as ILote));
  }

  criarLote(lote: ILote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value;
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Novo Lote' : nome;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): void {
    this.spinner.show();

    if (this.form.valid) {
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento)
        .subscribe(
          (eventoRetorno: IEvento) => {
            this.toastr.success('Evento salvo com sucesso!');
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          (error: any) => {
            this.toastr.error(`Erro ao salvar evento: ${error}`);
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public salvarLotes(): void {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!');
            this.lotes.reset();
          },
          (error: any) => {
            console.log(this.form.value.lotes, this.eventoId);
            this.toastr.error(`Erro ao salvar lotes: ${error}`);
            console.error(error);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Lote excluído com sucesso!');
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (error: any) => {
          this.toastr.error(`Erro ao excluir lote: ${error}`);
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();

    this.eventoService
      .postUpload(this.eventoId, this.file)
      .subscribe(
        () => {
          this.carregarEvento();
          this.toastr.success('Imagem atualizada com sucesso!');
        },
        (error: any) => {
          this.toastr.error(`Erro ao atualizar imagem`);
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }
}
