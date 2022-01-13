import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from 'src/app/_metronic/core/services/local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService implements OnDestroy {
	// private fields
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	// public fields
	currentUser$: Observable<UserModel>;
	isLoading$: Observable<boolean>;
	currentUserSubject: BehaviorSubject<UserModel>;
	isLoadingSubject: BehaviorSubject<boolean>;

	get currentUserValue(): UserModel {
		return this.currentUserSubject.value;
	}

	set currentUserValue(user: UserModel) {
		this.currentUserSubject.next(user);
	}

	constructor(
		private localStorageService: LocalStorageService,
		private authHttpService: AuthHTTPService,
		private router: Router,
		private permissionsService: NgxPermissionsService
	) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
		this.currentUser$ = this.currentUserSubject.asObservable();
		this.isLoading$ = this.isLoadingSubject.asObservable();
	}

	// public methods
	login(email: string, password: string): Observable<UserModel> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.login(email, password).pipe(
			map((auth: AuthModel) => {
				const result =
					this.localStorageService.setAuthFromLocalStorage(auth);
				return result;
			}),
			switchMap(() => this.getUserByToken()),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	logout() {
		this.localStorageService.logout();
		this.router.navigate(['/auth/login'], {
			queryParams: {},
		});
	}

	getUserByToken(): Observable<UserModel> {
		const auth = this.localStorageService.getAuthFromLocalStorage();
		// console.log('getUserByToken', auth);
		if (!auth || !auth.accessToken) {
			return of(undefined);
		}

		this.isLoadingSubject.next(true);
		return this.authHttpService.getUserByToken(auth.accessToken).pipe(
			tap((user: UserModel) => this.setRolePermissions(user)),
			map((user: UserModel) => {
				if (user) {
					this.currentUserSubject = new BehaviorSubject<UserModel>(
						user
					);
				} else {
					this.logout();
				}
				return user;
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	private setRolePermissions(user: UserModel) {
		const auth = this.localStorageService.getAuthFromLocalStorage();

		if (auth) {
			const jwt: any = jwt_decode(auth.accessToken);
			const roles =
				jwt[
					'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
				];
			this.permissionsService.flushPermissions();
			this.addCustomPermissions(user);
			if (roles && Array.isArray(roles)) {
				roles.forEach((m) => this.permissionsService.addPermission(m));
				user.rolesStr = roles.join(', ');
			} else {
				this.permissionsService.addPermission(roles);
				user.rolesStr = roles;
			}
		}

    console.log('user: ', user);
	}

	addCustomPermissions(user: UserModel) {
		// if (user.hasOpenSources) {
		// 	this.permissionsService.addPermission('open_sources', () => true);
		// }
		// if (user.company === 'Convenio Claro') {
		// 	this.permissionsService.addPermission('is_claro', () => true);
		// }
		// this.permissionsService.addPermission(
		// 	'open_sources',
		// 	(permissionName, permissionsObject) => {
		// 		console.log('permissionName', permissionName, 'permissionsObject', permissionsObject);
		// 		return !!permissionsObject[permissionName];
		// 	}
		// );
	}

	// need create new user then login
	registration(user: UserModel): Observable<any> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.createUser(user).pipe(
			map(() => {
				this.isLoadingSubject.next(false);
			}),
			switchMap(() => this.login(user.email, user.password)),
			catchError((err) => {
				console.error('err', err);
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	forgotPassword(email: string): Observable<boolean> {
		this.isLoadingSubject.next(true);
		return this.authHttpService
			.forgotPassword(email)
			.pipe(finalize(() => this.isLoadingSubject.next(false)));
	}

	// resetPassword(data: any) {
	//   this.isLoadingSubject.next(true);
	//   return this.authHttpService
	//     .resetPassword(data)
	//     .pipe(finalize(() => this.isLoadingSubject.next(false)));
	// }

	// changePassword(oldPassword: string, newPassword: string) {
	//   this.isLoadingSubject.next(true);
	//   return this.authHttpService
	//     .changePassword(oldPassword, newPassword)
	//     .pipe(finalize(() => this.isLoadingSubject.next(false)));
	// }

	// updatePersonnalInfo(user: Partial<UserModel>) {
	//   this.isLoadingSubject.next(true);
	//   return this.authHttpService
	//     .updatePersonnalInfo({
	//       pic: user.pic,
	//       fullName: user.fullName,
	//       company: user.company,
	//       phone: user.phoneNumber,
	//     })
	//     .pipe(finalize(() => this.isLoadingSubject.next(false)));
	// }

	refreshToken(): Observable<any> {
		return this.authHttpService.refreshToken();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
}
