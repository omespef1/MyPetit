export class GroomerDisponibilityModel {
	public id: number;
	public groomerId: number;
	public startDate: TimeObjectModel;
	public endDate: TimeObjectModel;
	public dayOfWeek: number;
}

export class TimeObjectModel {
	public hours: number;
	public minutes: number;
	public seconds: number;
}
