import {Component, OnInit} from '@angular/core';
import {Pedido} from '../models/pedido';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PedidoService} from '../services/pedido.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pedido',
  standalone: false,
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {

  listOfDisplayData: Pedido[] = [];
  totalPedidos = 0;
  isPedidoDrawerVisible = false;
  searchValue = '';
  currentEditingPedidoId: string | null = null;

  pedidoForm!: FormGroup;

  constructor(
    private pedidoService: PedidoService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForms();
  }

  get drawerTitle(): string {
    return this.currentEditingPedidoId ? 'Edição de Pedido' : 'Criação de Pedido';
  }

  ngOnInit(): void {
    this.loadPedidos();
  }

  openPedidoDrawer(): void {
    this.isPedidoDrawerVisible = true;
    this.currentEditingPedidoId = null;
    this.pedidoForm.reset({ status: 'PENDENTE' });
  }

  submitPedido(): void {
    if (this.pedidoForm.valid) {
      const pedidoData = this.pedidoForm.value;

      if (this.currentEditingPedidoId) {
        this.pedidoService.updatePedido(this.currentEditingPedidoId, pedidoData).subscribe({
          next: () => {
            this.loadPedidos();
            this.closePedidoDrawer();
            this.message.success('Pedido atualizado com sucesso! ✅');
          },
          error: () => this.message.error('Erro ao atualizar Pedido 🚫')
        });
      } else {
        this.pedidoService.addPedido(pedidoData).subscribe({
          next: () => {
            this.loadPedidos();
            this.closePedidoDrawer();
            this.message.success('Pedido criado com sucesso! ✅');
          },
          error: () => this.message.error('Erro ao criar Pedido 🚫')
        });
      }
    }
  }

  deletePedido(pedido: Pedido): void {
    this.modal.confirm({
      nzTitle: 'Tens certeza que quer eliminar o Pedido?',
      nzContent: `Pedido ID: <strong>${pedido.id}</strong>`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.pedidoService.deletePedido(pedido.id).subscribe({
          next: () => {
            this.loadPedidos();
            this.message.success('Pedido deletado com sucesso! 🗑️');
          },
          error: () => this.message.error('Erro ao deletar Pedido 🚫')
        });
      }
    });
  }

  editPedido(pedido: Pedido): void {
    this.currentEditingPedidoId = pedido.id;

    this.pedidoForm.patchValue({
      dataPedido: pedido.dataPedido,
      valorTotal: pedido.valorTotal,
      status: pedido.status,
      clienteId: pedido.clienteId
    });

    this.isPedidoDrawerVisible = true;
  }

  closePedidoDrawer(): void {
    this.isPedidoDrawerVisible = false;
    this.pedidoForm.reset({ status: 'PENDENTE' });
    this.currentEditingPedidoId = null;
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadPedidos();
      return;
    }
    this.listOfDisplayData = this.listOfDisplayData.filter(pedido =>
      pedido.status.toLowerCase().includes(val) ||
      pedido.clienteId.toLowerCase().includes(val)
    );
  }

  private loadPedidos(): void {
    this.pedidoService.getPedidos().subscribe(pedidos => {
      this.listOfDisplayData = pedidos;
      this.totalPedidos = pedidos.length;
    });
  }

  private initForms(): void {
    this.pedidoForm = this.fb.group({
      dataPedido: ['', Validators.required],
      valorTotal: [0, [Validators.required, Validators.min(0.01)]],
      status: ['PENDENTE', Validators.required],
      clienteId: ['', Validators.required]
    });
  }
}
