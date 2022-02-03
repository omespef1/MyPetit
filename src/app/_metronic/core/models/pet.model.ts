export class PetModel {
	public id: number;
	public ownerId: number;
	public name: string;
	public petTypeId: number;
	public breedId: number;
	public hairLengthId: number;
	public gender: number;
	public weight: number;
	public birthDate: Date;
	public pic: string;
	public observations: string;
	public tags: string[];

	public petTypeName: string;
	public breedName: string;
	public hairLengthName: string;
	public ownerName: string;
}
