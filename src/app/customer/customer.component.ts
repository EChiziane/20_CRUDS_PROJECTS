import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CustomerService} from '../services/customer.service';
import {Customer} from '../models/customer';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {



  customers: Customer[] = [];
  searchValue = '';
  isDrawerVisible = false;
  currentEditingCustomerId: string | null = null;
  customerForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingCustomerId ? 'Editar Cliente' : 'Novo Cliente';
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingCustomerId = null;
    this.customerForm.reset();
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.currentEditingCustomerId = null;
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  submitCustomer(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;

      if (this.currentEditingCustomerId) {
        this.customerService.updateCustomer(this.currentEditingCustomerId, customerData).subscribe({
          next: () => {
            this.loadCustomers();
            this.closeDrawer();
            this.message.success('Cliente atualizado com sucesso! ✅');
          },
          error: () => {
            this.message.error('Erro ao atualizar cliente 🚫');
          }
        });
      } else {
        this.customerService.addCustomer(customerData).subscribe({
          next: () => {
            this.loadCustomers();
            this.closeDrawer();
            this.message.success('Cliente criado com sucesso! 🎉');
          },
          error: () => {
            this.message.error('Erro ao criar cliente 🚫');
          }
        });
      }
    }
  }

  editCustomer(customer: Customer): void {
    this.currentEditingCustomerId = customer.id;
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    this.isDrawerVisible = true;
  }

  deleteCustomer(customer: Customer): void {
    this.modal.confirm({
      nzTitle: 'Tens certeza que quer eliminar este Cliente?',
      nzContent: `<strong>${customer.name}</strong>`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.customerService.deleteCustomer(customer.id).subscribe({
          next: () => {
            this.loadCustomers();
            this.message.success('Cliente removido com sucesso 🗑️');
          },
          error: () => {
            this.message.error('Erro ao remover cliente 🚫');
          }
        });
      }
    });
  }

  search(): void {
    const value = this.searchValue.toLowerCase();
    if (!value) {
      this.loadCustomers();
      return;
    }
    this.customers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value)
    );
  }

}
