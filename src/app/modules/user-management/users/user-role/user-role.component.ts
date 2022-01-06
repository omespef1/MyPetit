import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserRoleModel } from 'src/app/_metronic/core/models/user-role.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { UserService } from '../../services/user.service';
import { AddRoleModalComponent } from '../add-role-modal/add-role-modal.component';

@Component({
	selector: 'app-user-role',
	templateUrl: './user-role.component.html',
	styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
	@Input() userId: number;

	userRoles$: Observable<UserRoleModel[]>;
	isLoading$: Observable<boolean>;
	private subscriptions: Subscription[] = [];

	constructor(
		private userService: UserService,
		private readonly modalService: NgbModal,
		private readonly swalService: SwalService
	) {}

	ngOnInit(): void {
		this.searchUserRoles();
	}

	ngOnDestroy() {
		this.subscriptions.forEach((m) => m.unsubscribe());
	}

	searchUserRoles() {
		this.userRoles$ = this.userService.getRolesByUserId(this.userId);
	}

	add() {
		const modalRef = this.modalService.open(AddRoleModalComponent, {
			size: 'md',
		});
		modalRef.componentInstance.userId = this.userId;
		modalRef.result.then(
			() => this.searchUserRoles(),
			() => {}
		);
	}

	remove(role: UserRoleModel) {
		this.swalService
			.question('COMMON.DELETE_MESSAGE_QUESTION')
			.then((res) => {
				if (res.isConfirmed) {
					this.userService.removeRole(role).subscribe(() => {
						this.swalService.success('COMMON.RESOURCE_DELETED');
						this.searchUserRoles();
					});
				}
			});
	}
}
