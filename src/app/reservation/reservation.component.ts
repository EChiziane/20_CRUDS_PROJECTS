import {Component, OnInit} from '@angular/core';
import {Reservation} from '../models/reservation';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReservationService} from '../services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {

  listOfReservations: Reservation[] = [];
  searchValue = '';
  isDrawerVisible = false;
  currentEditingReservationId: string | null = null;

  reservationForm!: FormGroup;

  constructor(private reservationService: ReservationService,
              private fb: FormBuilder,
              private message: NzMessageService,
              private modal: NzModalService) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingReservationId ? 'Edit Reservation' : 'Create Reservation';
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingReservationId = null;
    this.reservationForm.reset();
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.reservationForm.reset();
    this.currentEditingReservationId = null;
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      const reservationData = this.reservationForm.value;

      if (this.currentEditingReservationId) {
        this.reservationService.updateReservation(this.currentEditingReservationId, reservationData).subscribe({
          next: () => {
            this.loadReservations();
            this.closeDrawer();
            this.message.success('Reservation updated successfully ✅');
          },
          error: () => {
            this.message.error('Error updating reservation 🚫');
          }
        });
      } else {
        this.reservationService.addReservation(reservationData).subscribe({
          next: () => {
            this.loadReservations();
            this.closeDrawer();
            this.message.success('Reservation created successfully ✅');
          },
          error: () => {
            this.message.error('Error creating reservation 🚫');
          }
        });
      }
    }
  }

  editReservation(reservation: Reservation): void {
    this.currentEditingReservationId = reservation.id;
    this.reservationForm.patchValue({
      guestName: reservation.guestName,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      roomNumber: reservation.roomNumber,
      totalPrice: reservation.totalPrice
    });
    this.isDrawerVisible = true;
  }

  deleteReservation(reservation: Reservation): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this reservation?',
      nzContent: `Guest: <strong>${reservation.guestName}</strong>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.reservationService.deleteReservation(reservation.id).subscribe({
          next: () => {
            this.loadReservations();
            this.message.success('Reservation deleted successfully 🗑️');
          },
          error: () => {
            this.message.error('Error deleting reservation 🚫');
          }
        });
      }
    });
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadReservations();
      return;
    }
    this.listOfReservations = this.listOfReservations.filter(res =>
      res.guestName.toLowerCase().includes(val) ||
      res.roomNumber.toString().includes(val)
    );
  }

  private loadReservations(): void {
    this.reservationService.getReservations().subscribe(reservations => {
      this.listOfReservations = reservations;
    });
  }

  private initForm(): void {
    this.reservationForm = this.fb.group({
      guestName: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      roomNumber: ['', Validators.required],
      totalPrice: ['', Validators.required],
    });
  }
}
