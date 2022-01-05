// Angular
import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
// RxJS
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { AuthHTTPService } from 'src/app/modules/auth/_services/auth-http';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private refreshTokenInProgress = false;
	// Refresh Token Subject tracks the current token, or is null if no token is currently
	// available (e.g. refresh pending).
	private refreshTokenSubject: BehaviorSubject<any> =
		new BehaviorSubject<any>(null);

	constructor(
		private auth: AuthHTTPService,
		private router: Router,
		private translationService: TranslationService,
		private localStorageService: LocalStorageService // private authNoticeService: AuthNoticeService
	) {}

	// intercept request and add token
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.localStorageService.getAuthFromLocalStorage();
		const lang = this.translationService.getSelectedLanguage();

		request = request.clone({
			setHeaders: { lang: lang },
		});

		if (token) {
			request = request.clone({
				setHeaders: { Authorization: `Bearer ${token.accessToken}` },
			});
		}

		return next.handle(request).pipe(
			catchError((err) => {
				console.log('error: ', err, this.refreshTokenInProgress);
				if (err.status !== 401) {
					throw err;
				}

				if (this.refreshTokenInProgress) {
					return this.refreshTokenSubject.pipe(
						filter((result) => result !== null),
						take(1),
						switchMap(() => {
							console.log('retomando consulta:');
							return next.handle(
								this.addAuthenticationToken(request)
							);
						})
					);
				} else {
					this.refreshTokenInProgress = true;
					this.refreshTokenSubject.next(null);

					return this.auth.refreshToken().pipe(
						switchMap((token: any) => {
							console.log('token actualizado: ', token);
							try {
								this.refreshTokenInProgress = false;
								this.refreshTokenSubject.next(token);
								this.localStorageService.setAuthFromLocalStorage(
									token
								);
								return next.handle(
									this.addAuthenticationToken(request)
								);
							} catch (error: any) {
								if (error.status === 401) {
									this.logout();
								}
							}
						}),
						catchError((error: any) => {
							console.log('error actualizando el token: ', err);
							this.refreshTokenInProgress = false;
							this.logout();
							// throw error;
							return of(undefined);
						})
					);
				}
			})
		);
	}

	logout() {
		this.localStorageService.logout();
		this.router.navigate(['/auth/login'], {
			queryParams: {},
		});
	}

	addAuthenticationToken(request) {
		// Get access token from Local Storage
		const token = this.localStorageService.getAuthFromLocalStorage();

		// If access token is null this means that user is not logged in
		// And we return the original request
		if (!token) {
			return request;
		}

		// We clone the request, because the original request is immutable
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token.accessToken}`,
			},
		});
	}
}

export const AuthInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: AuthInterceptor,
	multi: true,
};
