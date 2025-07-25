import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Payment} from '../../../models/WSM/payment';
import {Customer} from '../../../models/CSM/customer';
import {CustomerService} from '../../../services/customer.service';
import {PaymentService} from '../../../services/payment.service';


@Component({
  selector: 'app-customer-details',
  standalone: false,
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  @Input() customerId!: string;
  customer!: Customer;
  debtMonths: string[] = [];
  paymentDataSource: Payment[] = [];
  listOfDisplayData: Payment[] = [];

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private customerService: CustomerService,
              private paymentService: PaymentService) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
    });
    this.getCustomerPayments();
    this.getCustomer();
  }

  goBack() {
    window.history.back();
  }

  editCustomer() {

  }

  getCustomerPayments() {
    this.paymentService.getCustomerPayments(this.customerId).subscribe((payments: Payment[]) => {
      this.paymentDataSource = payments;
      this.listOfDisplayData = [...this.paymentDataSource]; // Atualiza após receber os dados
    });
  }

  printPayment(data: Payment) {

  }

  deletePayment(data: Payment) {

  }

  viewPayment(data: Payment) {

  }

  private getCustomer() {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer: Customer) => {
        this.customer = customer;
        this.calculateDebtMonths();
      }
    })
  }

  private calculateDebtMonths() {
    if (!this.customer || !this.customer.monthsInDebt) return;

    const currentMonth = new Date().getMonth();
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.debtMonths = [];
    for (let i = this.customer.monthsInDebt; i > 0; i--) {
      let monthIndex = (currentMonth - i + 12) % 12;
      this.debtMonths.push(monthNames[monthIndex]);
    }
  }
}
