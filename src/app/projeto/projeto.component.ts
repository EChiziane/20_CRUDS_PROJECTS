import {Component, OnInit} from '@angular/core';
import {Projeto} from '../models/Projeto';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ProjetoService} from '../services/projeto.service';

@Component({
  selector: 'app-projeto',
  standalone: false,
  templateUrl: './projeto.component.html',
  styleUrl: './projeto.component.scss'
})
export class ProjetoComponent implements OnInit {

  projetos: Projeto[] = [];
  totalProjetos = 0;
  totalProjetosEmAndamento = 0;
  totalProjetosConcluidos = 0;

  isDrawerVisible = false;
  projetoForm!: FormGroup;
  currentProjetoId: string | null = null;
  searchValue = '';

  constructor(
    private projetoService: ProjetoService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentProjetoId ? 'Editar Projeto' : 'Criar Projeto';
  }

  ngOnInit(): void {
    this.loadProjetos();
  }

  private initForm(): void {
    this.projetoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      status: ['EM_ANDAMENTO', Validators.required],
    });
  }

  private loadProjetos(): void {
    this.projetoService.getProjetos().subscribe(projetos => {
      this.projetos = projetos;
      this.totalProjetos = projetos.length;
      this.totalProjetosEmAndamento = projetos.filter(p => p.status === 'EM_ANDAMENTO').length;
      this.totalProjetosConcluidos = projetos.filter(p => p.status === 'CONCLUIDO').length;
    });
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentProjetoId = null;
    this.projetoForm.reset({ status: 'EM_ANDAMENTO' });
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.projetoForm.reset({ status: 'EM_ANDAMENTO' });
    this.currentProjetoId = null;
  }

  submitProjeto(): void {
    if (this.projetoForm.invalid) return;

    const projetoData = this.projetoForm.value;

    if (this.currentProjetoId) {
      this.projetoService.updateProjeto(this.currentProjetoId, projetoData).subscribe({
        next: () => {
          this.loadProjetos();
          this.closeDrawer();
          this.message.success('Projeto atualizado com sucesso ✅');
        },
        error: () => this.message.error('Erro ao atualizar projeto 🚫')
      });
    } else {
      this.projetoService.addProjeto(projetoData).subscribe({
        next: () => {
          this.loadProjetos();
          this.closeDrawer();
          this.message.success('Projeto criado com sucesso ✅');
        },
        error: () => this.message.error('Erro ao criar projeto 🚫')
      });
    }
  }

  editProjeto(projeto: Projeto): void {
    this.currentProjetoId = projeto.id;
    this.projetoForm.patchValue(projeto);
    this.isDrawerVisible = true;
  }

  deleteProjeto(projeto: Projeto): void {
    this.modal.confirm({
      nzTitle: 'Tens certeza que quer eliminar o projeto?',
      nzContent: `<strong>${projeto.nome}</strong>`,
      nzOkText: 'Sim',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.projetoService.deleteProjeto(projeto.id).subscribe({
          next: () => {
            this.loadProjetos();
            this.message.success('Projeto deletado com sucesso 🗑️');
          },
          error: () => this.message.error('Erro ao deletar projeto 🚫')
        });
      }
    });
  }

  search(): void {
    const term = this.searchValue.toLowerCase();
    if (!term) {
      this.loadProjetos();
      return;
    }
    this.projetos = this.projetos.filter(p =>
      p.nome.toLowerCase().includes(term) ||
      p.descricao.toLowerCase().includes(term)
    );
  }
}
