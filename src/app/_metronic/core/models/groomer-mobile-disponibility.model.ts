import { TimeObjectModel } from './groomer-disponibility.model';

export class GroomerMobileDisponibilityModel {
	public id: number;
	public groomerId: number;
	public startDate: TimeObjectModel;
	public endDate: TimeObjectModel;
	public dayOfWeek: number;
}
