import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';

export class UserModel extends AuthModel {
	id: string;
	userName: string;
	password: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	pic: string;
	companyLogo: string;
	roles: number[];
	rolesStr: string;
	ocupation: string;
	company: string;
	phoneNumber: string;
	rolId: string;
	convenioId: number;
	convenioGuid: string;
	usuarioConvenio: string;
	claveConvenio: string;
	address?: AddressModel;
	website: string;
	isAdmin: boolean;
	isSa: boolean;
	hasOpenSources: boolean;
	// account information
	language: string;
	timeZone: string;

	setUser(user: any) {
		this.id = user.id;
		this.userName = user.username || '';
		this.password = user.password || '';
		this.fullName = user.fullname || '';
		this.email = user.email || '';
		this.pic = user.pic || './assets/media/users/default.jpg';
		this.roles = user.roles || [];
		this.ocupation = user.occupation || '';
		this.company = user.company || '';
		this.phoneNumber = user.phoneNumber || '';
		this.address = user.address;
	}
}
