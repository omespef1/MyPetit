export class GroomerServiceModel {
	public id: number;
	public groomerId: number;
	public serviceDate: Date;
	public petId: number;

	public serviceGroomer: ServiceGroomerModel[] = [];
}

export class ServiceGroomerModel {
	public serviceId: number;
}
