import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BankAccount} from '../models/bankAccount';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {BankAccountService} from '../services/bankaccount.service';

@Component({
  selector: 'app-bankaccount',
  standalone: false,
  templateUrl: './bankaccount.component.html',
  styleUrl: './bankaccount.component.scss'
})
export class BankaccountComponent {


  listOfDisplayData: BankAccount[] = [];
  totalAccounts = 0;
  isDrawerVisible = false;
  searchValue = '';
  currentEditingAccountId: string | null = null;

  bankAccountForm!: FormGroup;

  constructor(
    private bankAccountService: BankAccountService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingAccountId ? 'Edit Bank Account' : 'Create Bank Account';
  }

  ngOnInit(): void {
    this.loadBankAccounts();
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingAccountId = null;
    this.bankAccountForm.reset();
  }

  submitBankAccount(): void {
    if (this.bankAccountForm.valid) {
      const accountData = this.bankAccountForm.value;

      if (this.currentEditingAccountId) {
        this.bankAccountService.updateBankAccount(this.currentEditingAccountId, accountData).subscribe({
          next: () => {
            this.loadBankAccounts();
            this.closeDrawer();
            this.message.success('Bank account updated successfully! ✅');
          },
          error: () => {
            this.message.error('Error updating bank account. 🚫');
          }
        });
      } else {
        this.bankAccountService.addBankAccount(accountData).subscribe({
          next: () => {
            this.loadBankAccounts();
            this.closeDrawer();
            this.message.success('Bank account created successfully! ✅');
          },
          error: () => {
            this.message.error('Error creating bank account. 🚫');
          }
        });
      }
    }
  }

  deleteBankAccount(bankAccount: BankAccount): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this Bank Account?',
      nzContent: `Account: <strong>${bankAccount.accountNumber}</strong>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.bankAccountService.deleteBankAccount(bankAccount.id).subscribe({
          next: () => {
            this.loadBankAccounts();
            this.message.success('Bank account deleted successfully! 🗑️');
          },
          error: () => {
            this.message.error('Error deleting bank account. 🚫');
          }
        });
      }
    });
  }

  editBankAccount(bankAccount: BankAccount): void {
    this.currentEditingAccountId = bankAccount.id;
    this.bankAccountForm.patchValue(bankAccount);
    this.isDrawerVisible = true;
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.bankAccountForm.reset();
    this.currentEditingAccountId = null;
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadBankAccounts();
      return;
    }
    this.listOfDisplayData = this.listOfDisplayData.filter(account =>
      account.accountHolder.toLowerCase().includes(val) ||
      account.accountNumber.toLowerCase().includes(val)
    );
  }

  private loadBankAccounts(): void {
    this.bankAccountService.getBankAccounts().subscribe(accounts => {
      this.listOfDisplayData = accounts;
      this.totalAccounts = accounts.length;
    });
  }

  private initForm(): void {
    this.bankAccountForm = this.fb.group({
      accountNumber: ['', Validators.required],
      accountHolder: ['', Validators.required],
      balance: [0, Validators.required],
      creditLimit: [0, Validators.required],
      openingDate: ['', Validators.required]
    });
  }

}
