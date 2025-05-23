import { Component, OnInit } from '@angular/core';
import { Sprint } from '../models/sprint';
import { SprintService } from '../services/sprint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Driver} from '../models/driver';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
  standalone: false
})
export class SprintComponent implements OnInit {

  listOfDisplayData: Sprint[] = [];
  totalSprints = 0;
  totalActiveSprints = 0;
  totalInactiveSprints = 0;
  isSprintDrawerVisible = false;
  searchValue = '';
  currentEditingSprintId: string | null = null;

  sprintForm!: FormGroup;

  constructor(private sprintService: SprintService,
              private fb: FormBuilder,
              private message: NzMessageService,
              private modal: NzModalService) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadSprints();
  }

  private loadSprints(): void {
    this.sprintService.getSprints().subscribe(sprints => {
      this.listOfDisplayData = sprints;
      this.totalActiveSprints= sprints.filter(d => d.status === 'ACTIVO').length;
      this.totalInactiveSprints= sprints.filter(d => d.status === 'INACTIVO').length;
      this.totalSprints = sprints.length;
    });
  }

  openSprintDrawer(): void {
    this.isSprintDrawerVisible = true;
    this.currentEditingSprintId = null; // Garante que seja criação
    this.sprintForm.reset({ status: 'ACTIVO' });
  }


  submitSprint(): void {
    if (this.sprintForm.valid) {
      const  sprintData= this.sprintForm.value;

      if(this.currentEditingSprintId){
        this.sprintService.updateSprint(this.currentEditingSprintId,sprintData).subscribe
        ({
            next: () => {
              this.loadSprints();
              this.closeSprintDrawer();
              this.message.success('Sprint atualizado com sucesso! ✅');
            },
            error: () => {
              this.message.error('Erro ao atualizar Sprint. 🚫');
            }
          }
        )
      }
      else
      {
        this.sprintService.addSprint(sprintData).subscribe(
          {
            next: () => {
              this.loadSprints();
              this.closeSprintDrawer();
              this.message.success('Sprint criado com sucesso! <UNK>');
            },
            error: () => {
              this.message.error('Erro ao criar motorista. <UNK>');
            }
          }
        )
      }

    }
  }


  deleteSprint(sprint: Sprint): void {
    this.modal.confirm({
      nzTitle:'Tens certeza que quer eliminar o Sprint?',
      nzContent: `Sprint: <strong>${sprint.name}</strong>`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzCancelText: 'Não',
      nzOnOk: () => {
        this.sprintService.deleteSprint(sprint.id).subscribe({
          next: () => {
            this.loadSprints();
            this.message.success('Sprint deletado com sucesso!🗑️');
          },
          error: () => {
            this.message.error('Erro ao deletar sprint.🚫');
          }
        })
      }

    })

  }


get driverDrawerTitle(): string {
    return this.currentEditingSprintId ? 'Edição de Sprint' : 'Criação de Sprint';
}

  editSprint(sprint: Sprint): void {
    this.currentEditingSprintId = sprint.id;

    this.sprintForm.patchValue({
      code: sprint.code,
      name: sprint.name,
    description: sprint.description,
     status: sprint.status
    });

    this.isSprintDrawerVisible = true;
  }


  closeSprintDrawer(): void {
    this.isSprintDrawerVisible = false;
    this.sprintForm.reset({ status: 'ACTIVO' });
    this.currentEditingSprintId = null;
  }

  search(): void {
    // Aqui podes implementar filtro local, ou chamar API com filtro
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadSprints();
      return;
    }
    this.listOfDisplayData = this.listOfDisplayData.filter(sprint =>
      sprint.code.toLowerCase().includes(val) ||
      sprint.description.toLowerCase().includes(val)
    );
  }

  private initForms(): void {
    this.sprintForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['ACTIVO', Validators.required],
    });
  }
}
