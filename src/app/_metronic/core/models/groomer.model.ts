import { GroomerDisponibilityModel } from './groomer-disponibility.model';

export class GroomerModel {
	public id: number;
	public thirdPartyId: number;
	public isActive: boolean;

	public thirdPartyDocumentNumber: string;
	public thirdPartyFullName: string;
	public thirdPartyEmail: string;
	public thidrPartyPhoneNumber: string;

	public disponibilities: GroomerDisponibilityModel[];
}
