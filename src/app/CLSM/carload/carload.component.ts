import {Component} from '@angular/core';
import {CarLoad} from '../../models/CSM/carlaod';
import {CarloadService} from '../../services/carload.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Driver} from '../../models/CSM/driver';
import {DriverService} from '../../services/driver.service';
import {Manager} from '../../models/WSM/manager';
import {ManagerService} from '../../services/manager.service';
import {Sprint} from '../../models/CSM/sprint';
import {SprintService} from '../../services/sprint.service';
import {NzI18nService} from 'ng-zorro-antd/i18n';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-carload',
  standalone: false,
  templateUrl: './carload.component.html',
  styleUrl: './carload.component.scss'
})
export class CarloadComponent {
  listOfDisplayData: CarLoad[] = [];
  dataDrivers: Driver[] = [];
  dataManagers: Manager[] = [];
  dataSprint: Sprint[] = [];

  allCarloads: CarLoad[] = []; // Todos os carloads

  totalCarloads: number = 0;
  isShowingScheduledOnly = false;
  toggleButtonText = 'Mostrar Agendados';


  // Drawer controls
  isCarloadDrawerVisible = false;
  searchValue = '';
  carloadForm!: FormGroup;




  constructor(private carloadService: CarloadService,
              private driverService: DriverService,
              private managerService: ManagerService,
              private sprintService: SprintService,
              private fb: FormBuilder,
              private i18n: NzI18nService,
              private modal: NzModalService,
              private message: NzMessageService) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadData();
  }

  getDrivers() {
    this.driverService.getDrivers().subscribe((drivers: Driver[]) => {
      this.dataDrivers = drivers;
    });
  }

  getSprinters() {
    this.sprintService.getSprints().subscribe((sprints: Sprint[]) => {
      this.dataSprint = sprints;
    })
  }

  getManages() {
    this.managerService.getManagers().subscribe((managers: Manager[]) => {
      this.dataManagers = managers;
    });
  }

  // Carload methods
  openCarloadDrawer(): void {
    this.isCarloadDrawerVisible = true;
  }

  // Search and filter
  search(): void {
    // Implement your search logic
  }

  viewCarload(carload: CarLoad) {
    // lógica para visualizar
  }

  printCarload(carload: CarLoad) {
    // lógica para imprimir
  }



  closeCarloadDrawer(): void {
    this.isCarloadDrawerVisible = false;
    this.carloadForm.reset({
      deliveryStatus: '',
      totalSpent: 0,
      totalEarnings: 0,
    });
    this.currentEditingCarloadId = null;
  }

  submitCarload(): void {
    if (this.carloadForm.valid) {
      const formValue = { ...this.carloadForm.value };

      if (formValue.deliveryStatus !== 'SCHEDULED') {
        formValue.deliveryScheduledDate = new Date(); // Hoje
      }

      if (this.currentEditingCarloadId) {
        // Atualizar carload existente
        this.carloadService.updateCarload(this.currentEditingCarloadId, formValue).subscribe(() => {
          this.loadCarloads();
          this.closeCarloadDrawer();
        });
      } else {
        // Criar novo carload
        this.carloadService.addCarload(formValue).subscribe(() => {
          this.loadCarloads();
          this.closeCarloadDrawer();
        });
      }
    }
  }




  private loadData(): void {
    this.loadCarloads();
    this.getDrivers()
    this.getManages()
    this.getSprinters()
  }
  // Carrega todos os carloads uma vez
  private loadCarloads(): void {
    this.carloadService.getCarloads().subscribe(carloads => {
      this.allCarloads = carloads;
      this.applyFilter();
    });
  }

  private initForms(): void {
    this.carloadForm = this.fb.group({
      deliveryDestination: ['', Validators.required],
      customerName: ['', Validators.required],
      logisticsManagerId: ['', Validators.required],
      assignedDriverId: ['', Validators.required],
      transportedMaterial: ['', Validators.required],
      carloadBatchId: ['', Validators.required],
      customerPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      totalSpent: [0, [Validators.required, Validators.min(0)]],
      totalEarnings: [0, [Validators.required, Validators.min(0)]],
      deliveryStatus: ['', Validators.required],
      deliveryScheduledDate:['']
    });
  }
  date = null;
  // ✅ Novas variáveis de controle
  showDeliveryDateField = false;
  showTotalEarningsField = true;


  isEnglish = false;


  onStatusChange(status: string): void {
    if (status === 'SCHEDULED') {
      this.showDeliveryDateField = true;
      this.showTotalEarningsField = false;
    } else {
      this.showDeliveryDateField = false;
      this.showTotalEarningsField = true;
    }
  }

  onChange(result: Date): void {
    console.log('Data de entrega selecionada:', result);
  }

  currentEditingCarloadId: string | null = null;

  editCarload(carload: CarLoad): void {
    this.currentEditingCarloadId = carload.id;
    this.carloadForm.patchValue({
      deliveryDestination: carload.deliveryDestination,
      customerName: carload.customerName,
      logisticsManagerId: carload.logisticsManagerId,
      assignedDriverId: carload.assignedDriverId,
      transportedMaterial: carload.transportedMaterial,
      carloadBatchId: carload.carloadBatchId,
      customerPhoneNumber: carload.customerPhoneNumber,
      totalSpent: carload.totalSpent,
      totalEarnings: carload.totalEarnings,
      deliveryStatus: carload.deliveryStatus,
      deliveryScheduledDate: carload.deliveryScheduledDate
    });
    this.showDeliveryDateField = carload.deliveryStatus === 'SCHEDULED';
    this.showTotalEarningsField = carload.deliveryStatus !== 'SCHEDULED';
    this.isCarloadDrawerVisible = true;
  }

  deleteCarload(carload: CarLoad): void {
    this.modal.confirm({
      nzTitle: 'Tens certeza que quer eliminar o Carregamento?',
      nzContent: `Destino: <strong>${carload.deliveryDestination}</strong>`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzCancelText: 'Não',
      nzOnOk: () =>
        this.carloadService.deleteCarload(carload.id).subscribe({
          next: () => {

            this.loadCarloads();
            this.message.success('Carregamento eliminado com sucesso! 🗑️');
          },
          error: () => {
            this.message.error('Erro ao eliminar carregamento. 🚫');
          }
        })
    });
  }

  toggleCarloads(): void {
    this.isShowingScheduledOnly = !this.isShowingScheduledOnly;
    this.toggleButtonText = this.isShowingScheduledOnly ? 'Mostrar Todos' : 'Mostrar Agendados';
    this.applyFilter();
  }

  // Aplica o filtro de acordo com a flag isShowingScheduledOnly
  private applyFilter(): void {
    if (this.isShowingScheduledOnly) {
      this.listOfDisplayData = this.allCarloads.filter(cl => cl.deliveryStatus === 'SCHEDULED');
    } else {
      this.listOfDisplayData = [...this.allCarloads];
    }
    this.totalCarloads = this.listOfDisplayData.length;
  }


  encerarCarload(carload: CarLoad): void {
    this.modal.confirm({
      nzTitle: 'Tens certeza que desejas encerrar este Carregamento?',
      nzContent: `Cliente: <strong>${carload.customerName}</strong><br>Destino: <strong>${carload.deliveryDestination}</strong>`,
      nzOkText: 'Sim, encerrar',
      nzOkType: 'primary',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const updatedCarload = { ...carload, deliveryStatus: 'DELIVERED' }; // ou outro status final

        this.carloadService.encerarCarload(carload.id, updatedCarload).subscribe({
          next: () => {
            this.message.success('Carregamento encerrado com sucesso ✅');
            this.loadCarloads(); // Atualiza a lista
          },
          error: () => {
            this.message.error('Erro ao encerrar o carregamento ❌');
          }
        });
      }
    });
  }

}
