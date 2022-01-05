import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { LocalStorageService } from 'src/app/_metronic/core/services/local-storage.service';

const API_USERS_URL = `${environment.apiUrl}/users`;
const API_AUTH_URL = `${environment.apiUrl}/auth`;

@Injectable({
	providedIn: 'root',
})
export class AuthHTTPService {
	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService
	) {}

	// public methods
	login(email: string, password: string): Observable<any> {
		return this.http.post<AuthModel>(`${API_AUTH_URL}/login`, {
			email,
			password,
		});
	}

	// CREATE =>  POST: add a new user to the server
	createUser(user: UserModel): Observable<UserModel> {
		return this.http.post<UserModel>(API_USERS_URL, user);
	}

	// Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
	forgotPassword(email: string): Observable<boolean> {
		return this.http.post<boolean>(`${API_AUTH_URL}/forgot-password`, {
			email,
		});
	}

	resetPassword(data: any) {
		return this.http.post(`${API_AUTH_URL}/reset_password`, data);
	}

	changePassword(oldPassword: string, newPassword: string) {
		return this.http.post<UserModel>(`${API_AUTH_URL}/change_password`, {
			oldPassword,
			newPassword,
		});
	}

	updatePersonnalInfo(data: any) {
		return this.http.put<UserModel>(
			`${API_AUTH_URL}/updatePersonnalInfo`,
			data
		);
	}

	getUserByToken(token): Observable<UserModel> {
		return this.http.get<UserModel>(`${API_AUTH_URL}/me`);
	}

	refreshToken() {
		const token = this.localStorageService.getAuthFromLocalStorage();

		return this.http.post(`${API_AUTH_URL}/refreshToken`, {
			token: token.accessToken,
			refreshToken: token.refreshToken,
		});
	}
}
