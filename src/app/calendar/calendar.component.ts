import { Component } from '@angular/core';
import _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;


@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  referenceDate: Date = new Date();
  selectedStartType: string = 'turno-dia';
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();

  calendarDays: { date: Date; type: string; label: string }[] = [];

  months = [
    { name: 'Janeiro', value: 0 },
    { name: 'Fevereiro', value: 1 },
    { name: 'Março', value: 2 },
    { name: 'Abril', value: 3 },
    { name: 'Maio', value: 4 },
    { name: 'Junho', value: 5 },
    { name: 'Julho', value: 6 },
    { name: 'Agosto', value: 7 },
    { name: 'Setembro', value: 8 },
    { name: 'Outubro', value: 9 },
    { name: 'Novembro', value: 10 },
    { name: 'Dezembro', value: 11 }
  ];

  generateSchedule() {
    this.calendarDays = [];

    const ciclo = ['turno-dia', 'turno-noite', 'folga-1', 'folga-2'];
    const baseIndex = ciclo.indexOf(this.selectedStartType);
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
    let startWeekday = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    // Ajustar para que Segunda seja 0 e Domingo seja 6
    startWeekday = (startWeekday + 6) % 7;

    // Adiciona células vazias antes do dia 1, se necessário
    for (let i = 0; i < startWeekday; i++) {
      this.calendarDays.push({ date: null as any, type: 'empty', label: '' });
    }

    // Preenche os dias do mês normalmente
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(this.selectedYear, this.selectedMonth, i);
      const diffDays = this.getDaysDiff(this.referenceDate, currentDate);
      const type = ciclo[(baseIndex + diffDays % 4 + 4) % 4];

      this.calendarDays.push({
        date: currentDate,
        type,
        label: this.getLabel(type)
      });
    }
  }


  getDaysDiff(d1: Date, d2: Date): number {
    const time1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
    const time2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
    return Math.round((time2 - time1) / (1000 * 60 * 60 * 24));
  }

  getLabel(type: string): string {
    switch (type) {
      case 'turno-dia': return 'Turno Dia';
      case 'turno-noite': return 'Turno Noite';
      case 'folga-1': return 'Folga 1';
      case 'folga-2': return 'Folga 2';
      default: return '';
    }
  }
}
