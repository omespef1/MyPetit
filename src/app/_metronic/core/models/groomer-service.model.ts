export class GroomerServiceModel {
	public id: number;
	public groomerId: number;
	public startDate: Date;
	public petId: number;
	public isMobile: boolean;
	public state: string;

	public serviceGroomer: number[] = [];
}
