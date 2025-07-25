import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/CSM/customer';

@Component({
  selector: 'app-customer',
  standalone:false,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  dataSource: Customer[] = [];
  listOfDisplayData: Customer[] = [];

  totalCustomers = 0;
  activeCustomers = 0;
  inactiveCustomers = 0;

  searchValue = '';
  visible = false;
  visible1 = false;

  isEditMode = false;
  drawerTitle = 'Criar Cliente';
  selectedCustomerId: any | null = null;

  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    contact: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    address: new FormControl('', Validators.required),
    status: new FormControl('ATIVO', Validators.required),
    valve: new FormControl(10, [Validators.required, Validators.min(0)]),
    monthsInDebt: new FormControl(1, [Validators.required, Validators.min(0)])
  });

  constructor(private http: HttpClient, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe((customers: Customer[]) => {
      this.dataSource = customers;
      this.listOfDisplayData = [...this.dataSource];
      this.calculateCustomerStats();
    });
  }

  calculateCustomerStats() {
    this.totalCustomers = this.dataSource.length;
    this.activeCustomers = this.dataSource.filter(c => c.status === 'ATIVO').length;
    this.inactiveCustomers = this.dataSource.filter(c => c.status === 'INATIVO').length;
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.dataSource.filter(
      (item: Customer) => item.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  open(): void {
    this.isEditMode = false;
    this.drawerTitle = 'Criar Cliente';
    this.customerForm.reset({ status: 'ATIVO', valve: 10, monthsInDebt: 1 });
    this.visible1 = true;
  }

  close(): void {
    this.visible1 = false;
    this.customerForm.reset();
    this.selectedCustomerId = null;
  }

  createCustomer() {
    if (this.customerForm.invalid) {
      console.error('Formulário inválido.');
      return;
    }

    if (this.isEditMode && this.selectedCustomerId) {
      this.customerService.updateCustomer(this.selectedCustomerId, this.customerForm.value).subscribe({
        next: (updatedCustomer) => {
          console.log('Cliente atualizado com sucesso:', updatedCustomer);
          this.getCustomers();
          this.close();
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
        }
      });
    } else {
      this.customerService.addCustomer(this.customerForm.value).subscribe({
        next: (newCustomer) => {
          console.log('Cliente criado com sucesso:', newCustomer);
          this.dataSource = [...this.dataSource, newCustomer];
          this.listOfDisplayData = [...this.dataSource];
          this.calculateCustomerStats();
          this.customerForm.reset({ status: 'ATIVO', valve: 10, monthsInDebt: 1 });
          this.close();
        },
        error: (err) => {
          console.error('Erro ao adicionar cliente:', err);
        }
      });
    }
  }

  editCustomer(customer: Customer): void {
    this.isEditMode = true;
    this.drawerTitle = 'Editar Cliente';
    this.selectedCustomerId = customer.id;
    this.visible1 = true;

    this.customerForm.patchValue({
      name: customer.name,
      contact: customer.contact,
      address: customer.address,
      status: customer.status,
      valve: customer.valve,
      monthsInDebt: customer.monthsInDebt
    });
  }

  viewCustomer(data: Customer) {
    console.log('Visualizar cliente:', data);
  }

  deleteCustomer(data: Customer) {
    // Lógica de exclusão aqui
  }
}
