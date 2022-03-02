import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-download-button',
	templateUrl: './download-button.component.html',
	styleUrls: ['./download-button.component.scss'],
})
export class DownloadButtonComponent implements OnInit, OnDestroy {
	@Input() fileName: string;
	@Input() reportUrl: string;
	@Input() parameters: string;
	@Input() title: string;
	@Input() icon: string;
	@Input() only_icon = false;
	@Input() disabled = false;
	isLoading: boolean;
	subscriptions: Subscription[] = [];

	constructor() {}

	ngOnInit(): void {}

  generate() {}
  // generate() {
	// 	this.isLoading = true;
	// 	const subs = this.fdfCreatorService
	// 		.generate(this.reportUrl, this.parameters)
	// 		.pipe(
	// 			catchError((err) => {
	// 				this.messageDialogService.showError(
	// 					ErrorUtil.getMessage(err)
	// 				);
	// 				this.isLoading = false;
	// 				throw err;
	// 			}),
	// 			finalize(() => {
	// 				this.isLoading = false;
	// 				this.ref.detectChanges();
	// 			})
	// 		)
	// 		.subscribe((response: Blob) => {
	// 			this.exportPdf(this.fileName, response);
	// 		});

	// 	this.subscriptions.push(subs);
	// }

  // export(fileName: string, blob: Blob) {
	// 	const newBlob = new Blob([blob], {
	// 		type: 'application/pdf',
	// 	});

	// 	// IE doesn't allow using a blob object directly as link href
	// 	// instead it is necessary to use msSaveOrOpenBlob
	// 	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
	// 		window.navigator.msSaveOrOpenBlob(newBlob);
	// 		return;
	// 	}

	// 	// For other browsers:
	// 	// Create a link pointing to the ObjectURL containing the blob.
	// 	const data = window.URL.createObjectURL(newBlob);

	// 	const link = document.createElement('a');
	// 	link.href = data;
	// 	link.download = `${fileName}_${new Date().getTime()}.pdf`;
	// 	// this is necessary as link.click() does not work on the latest firefox
	// 	link.dispatchEvent(
	// 		new MouseEvent('click', {
	// 			bubbles: true,
	// 			cancelable: true,
	// 			view: window,
	// 		})
	// 	);

	// 	setTimeout(() => {
	// 		// For Firefox it is necessary to delay revoking the ObjectURL
	// 		window.URL.revokeObjectURL(data);
	// 		link.remove();
	// 	}, 100);
	// }

	ngOnDestroy(): void {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}
}
