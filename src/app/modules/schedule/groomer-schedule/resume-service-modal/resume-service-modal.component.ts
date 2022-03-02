import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ServiceGroomerService } from '../../services/service-groomer.service';
import * as _moment from 'moment';
import { OwnerService } from 'src/app/modules/owner/services/owner.service';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import {
	FileUploadControl,
	FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-resume-service-modal',
	templateUrl: './resume-service-modal.component.html',
	styleUrls: ['./resume-service-modal.component.scss'],
})
export class ResumeServiceModalComponent
	implements OnInit, OnDestroy, AfterContentChecked
{
	@Input() id: number;

	pet: PetModel;
	service: any;
	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly ownerService: OwnerService,
		private readonly swal: SwalService,
		private readonly fb: FormBuilder,
		public readonly modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.serviceGroomerService.isLoading$;
		this.subscriptions.push(
			this.serviceGroomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => this.swal.error(err))
		);
	}

	ngOnInit(): void {
		if (this.id > 0) {
			this.serviceGroomerService
				.findResumeService(this.id)
				.subscribe((res: any) => {
					console.log('res: ', res);
					this.service = res;
					this.loadForm();
					this.findPetById(Number(res.petId));
				});
		} else {
			this.modal.close();
		}
	}

	public fileUploadControl = new FileUploadControl(null);

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	loadForm() {
		this.formGroup = this.fb.group({
			observations: [this.service.observations, Validators.required],
			files: new FormControl(null),
			// files: new FormControl(null, FileUploadValidators.fileSize(80000)),
			// files: new FormControl(null, FileUploadValidators.filesLimit(2)),
		});
	}

	download(fileId: number) {
		// const subs = this.serviceGroomerService
		// 	.downloadFile(this.id)
		// 	.subscribe();
		// this.subscriptions.push(subs);
		window.open(
			`${environment.apiUrl}/serviceGroomer/downloadFile/${fileId}`,
			'_blank'
		);
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		const formValues = this.formGroup.value;
		console.log('formValues: ', formValues);
		const formData = new FormData();
		formData.append('observations', formValues.observations);

		if (formValues.files) {
			(<File[]>formValues.files).forEach((fileToUpload) => {
				formData.append('file', fileToUpload, fileToUpload.name);
			});
		}

		const sbCreate = this.serviceGroomerService
			.saveResume(this.id, formData)
			.pipe(
				tap(() => {
					this.swal.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	findPetById(petId: number) {
		this.ownerService.getPetById(petId).subscribe((pet) => {
			this.pet = pet;
			console.log(pet);
		});
	}

	ngOnDestroy(): void {
		this.serviceGroomerService.ngOnDestroy();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation: string, controlName: string) {
		const control = this.formGroup.controls[controlName];
		return (
			control.hasError(validation) && (control.dirty || control.touched)
		);
	}

	isControlTouched(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.dirty || control.touched;
	}
}
