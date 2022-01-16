// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'dayOfWeek',
})
export class DayOfWeeekPipe implements PipeTransform {
	constructor(private translateService: TranslateService) {}
	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any): any {
		switch (value) {
			case 1:
				return this.translateService.instant('COMMON.MONDAY');
			case 2:
				return this.translateService.instant('COMMON.TUESDAY');
			case 3:
				return this.translateService.instant('COMMON.WEDNESDAY');
			case 4:
				return this.translateService.instant('COMMON.THURSDAY');
			case 5:
				return this.translateService.instant('COMMON.FRIDAY');
			case 6:
				return this.translateService.instant('COMMON.SATURDAY');
			case 7:
				return this.translateService.instant('COMMON.SUNDAY');

			default:
				break;
		}
	}
}
