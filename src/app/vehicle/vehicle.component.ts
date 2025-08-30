import { Component } from '@angular/core';
import {Vehicle} from '../models/Vehicle';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {VehicleService} from '../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  standalone: false,
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {


  vehicles: Vehicle[] = [];
  searchValue = '';
  isDrawerVisible = false;
  currentEditingVehicleId: string | null = null;
  vehicleForm!: FormGroup;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  get drawerTitle(): string {
    return this.currentEditingVehicleId ? 'Editar Veículo' : 'Adicionar Veículo';
  }

  private initForm(): void {
    this.vehicleForm = this.fb.group({
      model: ['', Validators.required],
      brand: ['', Validators.required],
      year: [null, Validators.required],
      licensePlate: ['', Validators.required],
      mileage: [0, Validators.required]
    });
  }

  private loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: data => this.vehicles = data,
      error: () => this.message.error('Erro ao carregar veículos')
    });
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingVehicleId = null;
    this.vehicleForm.reset();
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.vehicleForm.reset();
    this.currentEditingVehicleId = null;
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) return;

    const vehicleData = this.vehicleForm.value;

    if (this.currentEditingVehicleId) {
      this.vehicleService.updateVehicle(this.currentEditingVehicleId, vehicleData).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeDrawer();
          this.message.success('Veículo atualizado com sucesso ✅');
        },
        error: () => this.message.error('Erro ao atualizar veículo 🚫')
      });
    } else {
      this.vehicleService.addVehicle(vehicleData).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeDrawer();
          this.message.success('Veículo adicionado com sucesso 🚗');
        },
        error: () => this.message.error('Erro ao adicionar veículo 🚫')
      });
    }
  }

  editVehicle(vehicle: Vehicle): void {
    this.currentEditingVehicleId = vehicle.id;
    this.vehicleForm.patchValue(vehicle);
    this.isDrawerVisible = true;
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.modal.confirm({
      nzTitle: 'Confirmar exclusão',
      nzContent: `Tens certeza que queres excluir o veículo <b>${vehicle.model}</b>?`,
      nzOkText: 'Sim',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.vehicleService.deleteVehicle(vehicle.id).subscribe({
          next: () => {
            this.loadVehicles();
            this.message.success('Veículo eliminado com sucesso 🗑️');
          },
          error: () => this.message.error('Erro ao eliminar veículo 🚫')
        });
      }
    });
  }

  search(): void {
    const value = this.searchValue.toLowerCase();
    this.vehicles = this.vehicles.filter(v =>
      v.model.toLowerCase().includes(value) ||
      v.brand.toLowerCase().includes(value) ||
      v.licensePlate.toLowerCase().includes(value)
    );
  }

}
