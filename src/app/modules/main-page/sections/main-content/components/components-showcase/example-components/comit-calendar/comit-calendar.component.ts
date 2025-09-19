import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface ContributionDay {
  date: Date;
  level: number;
}

@Component({
  selector: 'app-comit-calendar',
  imports: [NgClass],
  templateUrl: './comit-calendar.component.html'
})
export class ComitCalendarComponent {
  weeks: ContributionDay[][] = [];

  ngOnInit() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes

    this.weeks = this.generateWeeks(startDate, endDate);
  }

  private generateWeeks(start: Date, end: Date): ContributionDay[][] {
    const weeks: ContributionDay[][] = [];
    let current = new Date(start);

    // Retrocede al domingo anterior si no empieza en domingo
    while (current.getDay() !== 0) {
      current.setDate(current.getDate() - 1);
    }

    while (current <= end) {
      const week: ContributionDay[] = [];

      for (let i = 0; i < 7; i++) {
        // Copia la fecha antes de modificarla
        const day = new Date(current);

        if (day < start || day > end) {
          week.push({ date: day, level: -1 }); // Día fuera del mes actual
        } else {
          week.push({ date: day, level: this.getLevelForDate(day) });
        }

        current.setDate(current.getDate() + 1);
      }

      weeks.push(week);
    }

    return weeks;
  }

  private getLevelForDate(date: Date): number {
    return Math.floor(Math.random() * 5);
  }

  getColumns(): ContributionDay[][] {
    const columns: ContributionDay[][] = [];

    // 7 columnas (una por día de la semana)
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const column: ContributionDay[] = [];

      for (const week of this.weeks) {
        if (week[dayIndex]) {
          column.push(week[dayIndex]);
        }
      }

      columns.push(column);
    }

    return columns;
  }
}
