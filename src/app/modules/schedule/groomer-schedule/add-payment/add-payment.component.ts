import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PaymentTypeService } from 'src/app/modules/common/services/payment-type.service';
import { PaymentTypeModel } from 'src/app/_metronic/core/models/payment-type.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { ServiceGroomerService } from '../../services/service-groomer.service';

@Component({
	selector: 'app-add-payment',
	templateUrl: './add-payment.component.html',
	styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
	@Input() groomerPetServiceId: number;
	@Input() value: number;

	formGroup: FormGroup;
	isLoading$: Observable<boolean>;
	paymentTypes: PaymentTypeModel[] = [];

	constructor(
		private readonly fb: FormBuilder,
    private readonly swal: SwalService,
		public readonly modal: NgbActiveModal,
		private readonly paymentTypeService: PaymentTypeService,
		private readonly serviceGroomerService: ServiceGroomerService
	) {
		this.isLoading$ = this.serviceGroomerService.isLoading$;
	}

	ngOnInit(): void {
		this.getAllPaymentTypes();
		this.initForm();
	}

	initForm() {
		this.formGroup = this.fb.group({
			value: [this.value, Validators.required],
			paymentTypeId: [undefined, Validators.required],
		});
	}

	get f() {
		return this.formGroup.value;
	}

	getAllPaymentTypes() {
		this.paymentTypeService
			.getAll()
			.subscribe((pt) => (this.paymentTypes = pt));
	}

	save() {
		this.serviceGroomerService
			.addPayment(
				this.groomerPetServiceId,
				this.f.paymentTypeId,
				this.f.value
			)
			.subscribe(() => {
        this.swal.success('PAYMENT.PAYMENT_CREATED');
				this.modal.close();
			});
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
