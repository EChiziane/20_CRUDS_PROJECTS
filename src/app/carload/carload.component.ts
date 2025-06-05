import {Component} from '@angular/core';
import {CarLoad} from '../models/carlaod';
import {CarloadService} from '../services/carload.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Driver} from '../models/driver';
import {DriverService} from '../services/driver.service';
import {Manager} from '../models/manager';
import {ManagerService} from '../services/manager.service';
import {Sprint} from '../models/sprint';
import {SprintService} from '../services/sprint.service';

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
  totalCarloads = 0;
  // Drawer controls
  isCarloadDrawerVisible = false;
  searchValue = '';
  carloadForm!: FormGroup;

  constructor(private carloadService: CarloadService,
              private driverService: DriverService,
              private managerService: ManagerService,
              private sprintService: SprintService,
              private fb: FormBuilder) {
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

  deleteCarload(carload: CarLoad) {
    // lógica para excluir
  }

  closeCarloadDrawer(): void {
    this.isCarloadDrawerVisible = false;
    this.carloadForm.reset({
      status: 'ATIVO',
      valve: 10,
      monthsInDebt: 1
    });
  }

  submitCarload(): void {
    if (this.carloadForm.valid) {
      this.carloadService.addCarload(this.carloadForm.value).subscribe(() => {
        this.loadCarloads();
        this.closeCarloadDrawer();
      });
    }
  }

  private loadData(): void {
    this.loadCarloads();
    this.getDrivers()
    this.getManages()
    this.getSprinters()
  }

  private loadCarloads(): void {
    this.carloadService.getCarloads().subscribe(carloads => {
      this.listOfDisplayData = carloads;
      this.totalCarloads = carloads.length;

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
      deliveryStatus: ['', Validators.required]
    });
  }


}
