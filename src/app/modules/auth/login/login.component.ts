import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorUtil } from 'src/app/_metronic/core/utils/error.util';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
	// KeenThemes mock, change it to:
	// defaultAuth = {
	//   email: '',
	//   password: '',
	// };
	defaultAuth: any = {
		email: 'darl.8910@gmail.com',
		password: 'qwerty',
	};
	loginForm: FormGroup;
	hasError: boolean;
	errorMessage: string;
	returnUrl: string;
	isLoading$: Observable<boolean>;

	// private fields
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	constructor(
		private fb: FormBuilder,
		public authService: AuthService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.isLoading$ = this.authService.isLoading$;
		// redirect to home if already logged in
		if (this.authService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.initForm();
		// get return url from route parameters or default to '/'
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}

	initForm() {
		this.loginForm = this.fb.group({
			email: [
				!environment.production ? this.defaultAuth.email : '',
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.minLength(3),
					Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
				]),
			],
			password: [
				!environment.production ? this.defaultAuth.password : '',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				]),
			],
		});
	}

	submit() {
		this.hasError = false;
		this.errorMessage = '';
		const loginSubscr = this.authService
			.login(this.f.email.value, this.f.password.value)
			.pipe(
				first(),
				catchError((err) => {
					console.log(err);
					this.errorMessage = ErrorUtil.getMessage(err);
					return of(undefined);
				})
			)
			.subscribe((user: UserModel) => {
				if (user) {
					this.router.navigate([this.returnUrl]);
				} else {
					this.hasError = true;
				}
			});
		this.unsubscribe.push(loginSubscr);
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
}
