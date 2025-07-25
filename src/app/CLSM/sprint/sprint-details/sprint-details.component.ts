import {Component, Input} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CarLoad} from '../../../models/CSM/carlaod';
import {Driver} from '../../../models/CSM/driver';
import {Manager} from '../../../models/WSM/manager';
import {Sprint} from '../../../models/CSM/sprint';
import {CarloadService} from '../../../services/carload.service';
import {ManagerService} from '../../../services/manager.service';
import {SprintService} from '../../../services/sprint.service';
import {DriverService} from '../../../services/driver.service';

@Component({
  selector: 'app-sprint-details',
  standalone: false,
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.scss'
})
export class SprintDetailsComponent {
  listOfDisplayData: CarLoad[] = [];
  dataDrivers: Driver[] = [];
  dataManagers: Manager[] = [];
  dataSprint: Sprint[] = [];
  totalCarloads = 0;
  @Input() sprintId!: string;
  // Drawer controls
  isCarloadDrawerVisible = false;
  searchValue = '';
  carloadForm!: FormGroup;

  constructor(private carloadService: CarloadService,
              private driverService: DriverService,
              private route: ActivatedRoute,
              private managerService: ManagerService,
              private sprintService: SprintService,
              private fb: FormBuilder) {

    this.initForms();
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.sprintId = params['id'];
    })

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

    this.carloadService.getCarloadsBySprint(this.sprintId).subscribe(carloads => {

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
