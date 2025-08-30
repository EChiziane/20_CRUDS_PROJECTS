import {Component, OnInit} from '@angular/core';
import {Employee} from '../models/employee';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  isEmployeeDrawerVisible = false;
  searchValue = '';
  currentEditingEmployeeId: string | null = null;

  employeeForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingEmployeeId ? 'Edit Employee' : 'Create Employee';
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  openEmployeeDrawer(): void {
    this.isEmployeeDrawerVisible = true;
    this.currentEditingEmployeeId = null;
    this.employeeForm.reset();
  }

  submitEmployee(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      if (this.currentEditingEmployeeId) {
        this.employeeService.updateEmployee(this.currentEditingEmployeeId, employeeData).subscribe({
          next: () => {
            this.loadEmployees();
            this.closeEmployeeDrawer();
            this.message.success('Employee updated successfully ✅');
          },
          error: () => {
            this.message.error('Error updating employee ❌');
          }
        });
      } else {
        this.employeeService.addEmployee(employeeData).subscribe({
          next: () => {
            this.loadEmployees();
            this.closeEmployeeDrawer();
            this.message.success('Employee created successfully ✅');
          },
          error: () => {
            this.message.error('Error creating employee ❌');
          }
        });
      }
    }
  }

  deleteEmployee(employee: Employee): void {
    this.modal.confirm({
      nzTitle: 'Are you sure to delete this employee?',
      nzContent: `<strong>${employee.name}</strong>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.loadEmployees();
            this.message.success('Employee deleted successfully 🗑️');
          },
          error: () => {
            this.message.error('Error deleting employee ❌');
          }
        });
      }
    });
  }

  editEmployee(employee: Employee): void {
    this.currentEditingEmployeeId = employee.id;
    this.employeeForm.patchValue(employee);
    this.isEmployeeDrawerVisible = true;
  }

  closeEmployeeDrawer(): void {
    this.isEmployeeDrawerVisible = false;
    this.employeeForm.reset();
    this.currentEditingEmployeeId = null;
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadEmployees();
      return;
    }
    this.employees = this.employees.filter(e =>
      e.name.toLowerCase().includes(val) ||
      e.position.toLowerCase().includes(val) ||
      e.department.toLowerCase().includes(val)
    );
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required],
      department: ['', Validators.required],
      createdAt: [new Date().toISOString()]
    });
  }
}
