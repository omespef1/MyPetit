import {
	AfterContentChecked,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { RoleModel } from 'src/app/_metronic/core/models/role.model';
import { UserRoleModel } from 'src/app/_metronic/core/models/user-role.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

const EMPTY_USER_ROLE: UserRoleModel = {
	userId: undefined,
	roleId: undefined,
	roleName: '',
	userName: '',
};

@Component({
	selector: 'app-add-role-modal',
	templateUrl: './add-role-modal.component.html',
	styleUrls: ['./add-role-modal.component.scss'],
})
export class AddRoleModalComponent
	implements OnInit, OnDestroy, AfterContentChecked
{
	@Input() userId: number;
	isLoading$: Observable<boolean>;
	isLoadingSave$: Observable<boolean>;
	formGroup: FormGroup;
	roles: RoleModel[] = [];
	userRole: UserRoleModel;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly roleService: RoleService,
		private readonly userService: UserService,
		private readonly swalService: SwalService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private readonly cdr: ChangeDetectorRef
	) {
		this.isLoading$ = this.roleService.isLoading$;
		this.isLoadingSave$ = this.userService.isLoading$;
		this.subscriptions.push(
			this.roleService.getAll().subscribe((p) => (this.roles = p))
		);
		this.subscriptions.push(
			this.roleService.errorMessage$
				.pipe(filter((r) => r !== ''))
				.subscribe((err) => swalService.error(err))
		);
	}

	ngOnInit(): void {
		this.loadForm();
		this.userRole = this.getNewInstance();
	}

	ngAfterContentChecked() {
		this.cdr.detectChanges();
	}

	getNewInstance() {
		return { ...EMPTY_USER_ROLE };
	}

	loadForm() {
		this.formGroup = this.fb.group({
			roleId: [undefined, Validators.compose([Validators.required])],
		});
	}

	save() {
		this.create();
	}

	create() {
		this.userRole.roleId = this.formGroup.controls.roleId.value;
		const sbCreate = this.userService
			.createUserRole(this.userId, this.userRole)
			.pipe(
				tap(() => {
					this.swalService.success('COMMON.RESOURCE_CREATED');
				})
			)
			.subscribe((res) => {
				this.modal.close();
			});
		this.subscriptions.push(sbCreate);
	}

	ngOnDestroy(): void {
		this.roleService.ngOnDestroy();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
