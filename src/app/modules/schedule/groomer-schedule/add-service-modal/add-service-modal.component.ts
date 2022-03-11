import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { OwnerService } from 'src/app/modules/owner/services/owner.service';
import { PetServiceService } from 'src/app/modules/pet-management/services/pet-service.service';
import { GroomerServiceModel } from 'src/app/_metronic/core/models/groomer-service.model';
import { PetServiceModel } from 'src/app/_metronic/core/models/pet-service.model';
import { PetModel } from 'src/app/_metronic/core/models/pet.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ServiceGroomerService } from '../../services/service-groomer.service';
import * as _moment from 'moment';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { GroomerService } from 'src/app/modules/common/services/groomer.service';
import { GroomerModel } from 'src/app/_metronic/core/models/groomer.model';

const EMPTY_GROOMER_SERVICE: GroomerServiceModel = {
	id: undefined,
	groomerId: undefined,
	petId: undefined,
	isMobile: false,
	state: 'Created',
	startDate: new Date(),
	serviceGroomer: [],
};

@Component({
	selector: 'app-add-service-modal',
	templateUrl: './add-service-modal.component.html',
	styleUrls: ['./add-service-modal.component.scss'],
})
export class AddServiceModalComponent
	implements OnInit, OnDestroy, AfterContentChecked
{
	@Input() id: number;
	@Input() groomerId: number;
	@Input() startDate: Date;
	@Input() isMobile: boolean;

	pet: PetModel;
	isLoading$: Observable<boolean>;
	isLoadingPet$: Observable<boolean>;
	formGroup: FormGroup;
	groomers: GroomerModel[] = [];
	service: GroomerServiceModel;
	petServices: PetServiceModel[] = [];
	showServices = false;
	now: Date = new Date();
	name_formatter = (x: any) =>
		`${x.thirdPartyDocumentNumber} - ${x.thirdPartyFullName}`;

	private subscriptions: Subscription[] = [];

	constructor(
		private readonly serviceGroomerService: ServiceGroomerService,
		private readonly groomerService: GroomerService,
		private readonly petServiceService: PetServiceService,
		private readonly ownerService: OwnerService,
		private readonly swal: SwalService,
		private readonly fb: FormBuilder,
		private readonly modalService: NgbModal,
		public readonly modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.serviceGroomerService.isLoading$;
		this.isLoadingPet$ = this.ownerService.isLoading$;
		this.subscriptions.push(
			this.serviceGroomerService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swal.error(err))
		);
	}

	ngOnInit(): void {
		if (this.id > 0) {
			this.serviceGroomerService
				.getItemById(this.id)
				.subscribe((res: any) => {
					this.service = {
						groomerId: res.groomerId,
						id: res.id,
						state: res.state,
						petId: res.petId,
						startDate: res.startDate,
						isMobile: res.isMobile,
						serviceGroomer: (<any[]>(
							res.serviceGroomerPetServices
						)).map((i) => {
							return i.serviceId;
						}),
					};
					this.loadForm();
					this.petChange(res.petId);
				});
		} else {
			this.service = this.getNewInstance();
			this.loadForm();
		}
	}

	get endDate() {
		const totalDuration = (<any[]>this.services.value)
			.filter((m) => m.serviceId !== null)
			.reduce((sum, current) => sum + current.duration, 0);
		return new Date(this.startDate.getTime() + totalDuration * 60000);
	}

	getGroomersByPetId(petId: number) {
		this.groomerService
			.getAllByPetId(petId)
			.subscribe((g: GroomerModel[]) => (this.groomers = g));
	}

	addPayment() {
		const modalRef = this.modalService.open(AddPaymentComponent, {
			size: 'sm',
		});
		modalRef.componentInstance.groomerPetServiceId = this.id;
		modalRef.componentInstance.value = this.totalServices ?? 0;
		modalRef.result.then(
			() => this.modal.close(),
			() => {}
		);
	}

	startService() {
		this.swal.question('SCHEDULE.START_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.serviceGroomerService.start(this.id).subscribe(() => {
					this.swal.success('SCHEDULE.SERVICE_STARTED');
					this.modal.close();
				});
			}
		});
	}

	loadCreatedServies() {
		if (this.service.serviceGroomer) {
			this.service.serviceGroomer.forEach((m) => {
				this.addNewService();
				const ctrls = (<FormGroup>(
					this.services.at(this.services.length - 1)
				)).controls;
				ctrls.serviceId.setValue(m);
			});
		}
	}

	searchDetail() {
		this.serviceGroomerService
			.getItemById(this.id)
			.subscribe((res: any) => {
				this.service = {
					groomerId: res.groomerId,
					id: res.id,
					state: res.state,
					isMobile: res.isMobile,
					petId: res.petId,
					startDate: res.startDate,
					serviceGroomer: (<any[]>res.serviceGroomerPetServices).map(
						(i) => {
							return i.serviceId;
						}
					),
				};
			});
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	getAllServicesByPetId(petId: number) {
		this.petServiceService.getByPetId(petId).subscribe((s) => {
			this.petServices = s;
			if (Number(this.id) > 0) {
				this.loadCreatedServies();
			}
		});
	}

	findPetById(petId: number) {
		console.log('findPetById: ', petId);
		this.ownerService.getPetById(petId).subscribe((pet) => {
			this.pet = pet;
			this.getAllServicesByPetId(pet.id);
		});
	}

	findServiceById(serviceId: number) {
		return this.petServices.find((m) => m.id === serviceId);
	}

	petChange(petId: number) {
		console.log('petchange: ', petId);
		if (petId) {
			this.f.petId.setValue(petId);
			this.findPetById(petId);
			this.showServices = true;

			if (Number(this.id) === 0) {
				this.clearServices();
				this.addNewService();
			}

			if (this.groomerId === -1) {
				this.getGroomersByPetId(petId);
			}
		}
	}

	clearServices() {
		while (this.services.length !== 0) {
			this.services.removeAt(0);
		}
	}

	getNewInstance() {
		return { ...EMPTY_GROOMER_SERVICE, isMobile: this.isMobile };
	}

	get f() {
		return this.formGroup.controls;
	}

	loadForm() {
		this.formGroup = this.fb.group({
			groomerId: [this.groomerId],
			petId: [
				this.service.petId,
				Validators.compose([Validators.required]),
			],
			startDate: [
				_moment(this.startDate).format('YYYY-MM-DD HH:mm:ss'),
				Validators.compose([Validators.required]),
			],
			services: this.fb.array([]),
		});
	}

	removeService(index: number) {
		this.services.removeAt(index);
		this.cdr.detectChanges();
	}

	get services() {
		return this.formGroup.controls['services'] as FormArray;
	}

	set services(value: FormArray) {
		this.formGroup.controls['services'].setValue(value);
	}

	get totalServices() {
		return (<any[]>this.services.value)
			.filter((m) => m.serviceId !== null)
			.reduce((sum, current) => sum + current.cost, 0);
	}

	addNewService() {
		const serviceForm = this.fb.group({
			serviceId: [undefined, Validators.required],
			cost: [0],
			duration: [0],
		});

		this.subscriptions.push(
			serviceForm.controls.serviceId.valueChanges.subscribe(
				(petServiceId) => {
					const service = this.petServices.find(
						(m) => m.id === Number(petServiceId)
					);
					serviceForm.controls.cost.setValue(service.cost);
					serviceForm.controls.duration.setValue(service.duration);
				}
			)
		);

		this.services.push(serviceForm);
	}

	changePic(pic: string) {
		this.formGroup.controls.pic.setValue(pic);
	}

	save() {
		this.formGroup.markAllAsTouched();
		if (!this.formGroup.valid) {
			return;
		}

		this.formGroup.controls.startDate.setValue(
			_moment(this.startDate).format('YYYY-MM-DD HH:mm:ss')
		);
		const formValues = this.formGroup.value;
		this.service = Object.assign(this.service, formValues);

		this.service.serviceGroomer = (<any[]>formValues.services).map(
			(m) => m.serviceId
		);

		if (this.id > 0) {
			this.edit();
		} else {
			this.create();
		}
	}

	create() {
		const sbCreate = this.serviceGroomerService
			.createService(this.service)
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

	edit() {
		const sbCreate = this.serviceGroomerService
			.updateService(this.service)
			.pipe(
				tap(() => {
					this.swal.success('COMMON.RESOURCE_UPDATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	ngOnDestroy(): void {
		this.serviceGroomerService.ngOnDestroy();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	isControlValid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
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
