import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {Recibo} from '../models/CSM/Recibo';
import {ReciboService} from '../services/recibo.service';


@Component({
  selector: 'app-recibo',
  standalone: false,
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.scss']
})
export class ReciboComponent implements OnInit {
  dataSource: Recibo[] = [];
  listOfDisplayData: Recibo[] = [];

  searchValue = '';
  visible = false;
  visibleDrawer = false;

  isEditMode = false;
  drawerTitle = 'Criar Recibo';
  selectedReciboId: string | null = null;

  reciboForm = new FormGroup({
    nomeCliente: new FormControl('', Validators.required),
    fileName: new FormControl('', Validators.required),
    filePath: new FormControl('', Validators.required),
    createdAt: new FormControl('', Validators.required)
  });

  constructor(
    private http: HttpClient,
    private reciboService: ReciboService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getRecibos();
  }

  getRecibos() {
    this.reciboService.getRecibos().subscribe((recibos: Recibo[]) => {
      this.dataSource = recibos;
      this.listOfDisplayData = [...this.dataSource];
    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.dataSource.filter(
      (item: Recibo) =>
        item.nomeCliente.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        item.fileName.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  open(): void {
    this.isEditMode = false;
    this.drawerTitle = 'Criar Recibo';
    this.reciboForm.reset();
    this.visibleDrawer = true;
  }

  close(): void {
    this.visibleDrawer = false;
    this.reciboForm.reset();
    this.selectedReciboId = null;
  }

  createRecibo() {
    if (this.reciboForm.invalid) {
      this.message.warning('Preencha todos os campos obrigatórios!');
      return;
    }

    if (this.isEditMode && this.selectedReciboId) {
      this.reciboService.updateRecibo(this.selectedReciboId, this.reciboForm.value as Recibo).subscribe({
        next: () => {
          this.getRecibos();
          this.close();
          this.message.success('Recibo atualizado com sucesso! ✅');
        },
        error: () => {
          this.message.error('Erro ao atualizar recibo. 🚫');
        }
      });
    } else {
      this.reciboService.addRecibo(this.reciboForm.value as Recibo).subscribe({
        next: (newRecibo) => {
          this.dataSource = [...this.dataSource, newRecibo];
          this.listOfDisplayData = [...this.dataSource];
          this.reciboForm.reset();
          this.close();
          this.message.success('Recibo criado com sucesso! ✅');
        },
        error: () => {
          this.message.error('Erro ao criar recibo. 🚫');
        }
      });
    }
  }

  editRecibo(recibo: Recibo): void {
    this.isEditMode = true;
    this.drawerTitle = 'Editar Recibo';
    this.selectedReciboId = recibo.id;
    this.visibleDrawer = true;

    this.reciboForm.patchValue({
      nomeCliente: recibo.nomeCliente,
      fileName: recibo.fileName,
      filePath: recibo.filePath,
      createdAt: recibo.createdAt
    });
  }

  viewRecibo(data: Recibo) {
    console.log('Visualizar recibo:', data);
  }

  deleteRecibo(data: Recibo) {
    this.modal.confirm({
      nzTitle: 'Tens certeza que quer eliminar este Recibo?',
      nzContent: `Recibo: <strong>${data.fileName}</strong>`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.reciboService.deleteRecibo(data.id).subscribe({
          next: () => {
            this.getRecibos();
            this.message.success('Recibo deletado com sucesso! 🗑️');
          },
          error: () => {
            this.message.error('Erro ao deletar recibo. 🚫');
          }
        });
      }
    });
  }
}
