import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
const now = new Date();
@Component({
	selector: 'app-groomer-schedule',
	templateUrl: './groomer-schedule.component.html',
	styleUrls: ['./groomer-schedule.component.scss'],
})
export class GroomerScheduleComponent implements OnInit {
	model: NgbDateStruct;
	date: { year: number; month: number };




  currentValue: Date = new Date();

  firstDay = 0;

  minDateValue: Date | null = null;

  maxDateValue: Date | null = null;

  disabledDates: Function | null = null;

  zoomLevels: string[] = [
    'month', 'year', 'decade', 'century',
  ];

  cellTemplate = 'cell';

  holydays: any = [[1, 0], [4, 6], [25, 11]];
  getCellCssClass(date) {
    let cssClass = '';

    if (this.isWeekend(date)) { cssClass = 'weekend'; }

    this.holydays.forEach((item) => {
      if (date.getDate() === item[0] && date.getMonth() === item[1]) {
        cssClass = 'holyday';
        return false;
      }
    });

    return cssClass;
  }
  isWeekend(date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }
  
	constructor() {}

	ngOnInit(): void {}

	selectToday() {
		this.model = {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
	}
}
