import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { DayOfWeeekPipe } from './pipes/day-of-week.pipe';

@NgModule({
	declarations: [FirstLetterPipe, SafePipe, DayOfWeeekPipe],
	imports: [CommonModule],
	exports: [FirstLetterPipe, SafePipe, DayOfWeeekPipe],
})
export class CoreModule {}
