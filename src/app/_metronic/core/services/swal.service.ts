import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root',
})
export class SwalService {
	constructor(private translateService: TranslateService) {}

	notify(message: string) {
		notify(this.translateService.instant(message), 'success', 2000);
	}

	success(html: string) {
		Swal.fire({
			// position: 'top-end',
			icon: 'success',
			title: '¡Correcto!',
			html: this.translateService.instant(html),
			showConfirmButton: false,
			timer: 1500,
		});
	}

	error(html: string) {
		Swal.fire({
			icon: 'error',
			title: '¡Error!',
			html: this.translateService.instant(html),
			showConfirmButton: true,
		});
	}

	question(text: string) {
		const swal = Swal.fire({
			title: this.translateService.instant('COMMON.ARE_YOU_SURE'),
			text: this.translateService.instant(text),
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3699FF',
			cancelButtonColor: '#F64E60',
			confirmButtonText: this.translateService.instant('COMMON.YES'),
			cancelButtonText: this.translateService.instant('COMMON.CANCEL'),
		});
		swal.then((res) => {
			if (res.isConfirmed) {
				Swal.showLoading();
			}
		});

		return swal;
	}
}
