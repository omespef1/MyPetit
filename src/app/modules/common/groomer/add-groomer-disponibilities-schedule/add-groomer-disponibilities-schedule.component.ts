import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GroomerDisponibilityModel } from 'src/app/_metronic/core/models/groomer-disponibility.model';
import { SwalService } from 'src/app/_metronic/core/services/swal.service';
import { GroomerService } from '../../services/groomer.service';
import Query from 'devextreme/data/query';
import { DxSchedulerComponent } from 'devextreme-angular';
import { RefreshGroomerDisponibilitiesService } from '../add-disponibilities/refresh-groomer-disponibilities.service';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

export class TheatreData {
	text: string;
	id: number;
}

export class MovieData {
	id: number;
	text: string;
	director: string;
	year: number;
	image: string;
	duration: number;
	color: string;
}

export class Data {
	theatreId: number;
	movieId: number;
	price: number;
	startDate: Date;
	endDate: Date;
}

@Component({
	selector: 'app-add-groomer-disponibilities-schedule',
	templateUrl: './add-groomer-disponibilities-schedule.component.html',
	styleUrls: ['./add-groomer-disponibilities-schedule.component.scss'],
})
export class AddGroomerDisponibilitiesScheduleComponent implements OnInit {
	@Input() groomerId: number;
	disponibilities$: Observable<GroomerDisponibilityModel[]>;
	isLoading$: Observable<boolean>;
	// currentDate: Date = new Date(2021, 2, 28);
	currentDate: Date = new Date(1901, 0, 1);
	data: Data[] = [];
	moviesData: MovieData[];
	theatreData: TheatreData[];
	@ViewChild(DxSchedulerComponent, { static: false })
	scheduler: DxSchedulerComponent;

	constructor(
		private readonly refreshGroomerDisponibilitiesService: RefreshGroomerDisponibilitiesService,
		private readonly groomerService: GroomerService,
		private readonly translateService: TranslateService,
		private readonly swal: SwalService
	) {}

	ngOnInit(): void {
		// this.data = data;
		this.moviesData = moviesData;
		this.theatreData = theatreData;

		this.isLoading$ = this.groomerService.isLoading$;
		this.searchAllPets();
		this.refreshGroomerDisponibilitiesService.refreshData$.subscribe(() =>
			this.searchAllPets()
		);
	}

	searchAllPets() {
		this.groomerService
			.getAllDisponibilities(this.groomerId)
			.subscribe((d) => this.processData(d));
	}

	print(e) {
		console.log(e);
	}

	processData(disponibilities: GroomerDisponibilityModel[]) {
		this.data = [];
		disponibilities.forEach((m) => {
			this.data.push({
				startDate: new Date(
					1901,
					0,
					1,
					m.startDate.hours,
					m.startDate.minutes,
					m.startDate.seconds
				),
				endDate: new Date(
					1901,
					0,
					1,
					m.endDate.hours,
					m.endDate.minutes,
					m.endDate.seconds
				),
				movieId: 1,
				price: 5,
				theatreId: m.dayOfWeek,
			});
		});
	}

	deleteDisponibility(disponibility: GroomerDisponibilityModel) {
		this.swal.question('COMMON.DELETE_MESSAGE_QUESTION').then((res) => {
			if (res.isConfirmed) {
				this.groomerService
					.deleteDisponibility(disponibility.id)
					.subscribe(() => {
						this.swal.success('COMMON.RESOURCE_DELETED');
						this.searchAllPets();
					});
			}
		});
	}

	convertToMinutes(startDate: Date, endDate: Date) {
		const resta = endDate.getTime() - startDate.getTime();
		return Math.round(resta / (1000 * 60));
	}

	onAppointmentFormOpening(data) {
		const that = this;
		const form = data.form;
		// let movieInfo = that.getMovieById(data.appointmentData.movieId) || {};
		const duration = 30;
		let startDate = data.appointmentData.startDate;

		form.option('items', [
			{
				label: {
					text: this.translateService.instant('GROOMER.START_DATE'),
				},
				dataField: 'startDate',
				editorType: 'dxDateBox',
				editorOptions: {
					// width: '100%',
					// type: 'datetime',
					// onValueChanged(args) {
					// 	startDate = args.value;
					// 	form.updateData(
					// 		'endDate',
					// 		new Date(startDate.getTime() + 60 * 1000 * duration)
					// 	);
					// },
					width: '100%',
					type: 'time',
					pickerType: 'calendar',
					readOnly: false,
				},
			},
			{
				label: {
					text: this.translateService.instant('GROOMER.END_DATE'),
				},
				name: 'endDate',
				dataField: 'endDate',
				editorType: 'dxDateBox',
				editorOptions: {
					width: '100%',
					type: 'time',
					pickerType: 'calendar',
					readOnly: false,
				},
			},
			{
				label: {
					text: this.translateService.instant('GROOMER.DAY'),
				},
				editorType: 'dxSelectBox',
				dataField: 'theatreId',
				editorOptions: {
					items: that.theatreData,
					displayExpr: 'text',
					valueExpr: 'id',
					onValueChanged(args) {
						// movieInfo = that.getMovieById(args.value);
						// form.updateData('director', movieInfo.director);
						// form.updateData(
						// 	'endDate',
						// 	new Date(
						// 		startDate.getTime() +
						// 			60 * 1000 * movieInfo.duration
						// 	)
						// );
					},
				},
			},
		]);
	}
}

const theatreData: TheatreData[] = [
	{
		text: 'Domingo',
		id: 0,
	},
	{
		text: 'Lunes',
		id: 1,
	},
	{
		text: 'Martes',
		id: 2,
	},
	{
		text: 'Miercoles',
		id: 3,
	},
	{
		text: 'Jueves',
		id: 4,
	},
	{
		text: 'Viernes',
		id: 5,
	},
	{
		text: 'Sábado',
		id: 6,
	},
];

const moviesData: MovieData[] = [
	{
		id: 1,
		text: 'His Girl Friday',
		director: 'Howard Hawks',
		year: 1940,
		image: 'images/movies/HisGirlFriday.jpg',
		duration: 92,
		color: '#cb6bb2',
	},
	{
		id: 2,
		text: 'Royal Wedding',
		director: 'Stanley Donen',
		year: 1951,
		image: 'images/movies/RoyalWedding.jpg',
		duration: 93,
		color: '#56ca85',
	},
	{
		id: 3,
		text: 'A Star Is Born',
		director: 'William A. Wellman',
		year: 1937,
		image: 'images/movies/AStartIsBorn.jpg',
		duration: 111,
		color: '#1e90ff',
	},
	{
		id: 4,
		text: 'The Screaming Skull',
		director: 'Alex Nicol',
		year: 1958,
		image: 'images/movies/ScreamingSkull.jpg',
		duration: 68,
		color: '#ff9747',
	},
	{
		id: 5,
		text: "It's a Wonderful Life",
		director: 'Frank Capra',
		year: 1946,
		image: 'images/movies/ItsAWonderfulLife.jpg',
		duration: 130,
		color: '#f05797',
	},
	{
		id: 6,
		text: 'City Lights',
		director: 'Charlie Chaplin',
		year: 1931,
		image: 'images/movies/CityLights.jpg',
		duration: 87,
		color: '#2a9010',
	},
];

const data: Data[] = [
	{
		theatreId: 0,
		movieId: 3,
		price: 10,
		startDate: new Date('1901-01-01T16:10:00.000Z'),
		endDate: new Date('1901-01-01T18:01:00.000Z'),
	},
	{
		theatreId: 0,
		movieId: 1,
		price: 5,
		startDate: new Date('1901-01-01T18:30:00.000Z'),
		endDate: new Date('1901-01-01T20:02:00.000Z'),
	},
	{
		theatreId: 2,
		movieId: 3,
		price: 15,
		startDate: new Date('1901-01-01T20:30:00.000Z'),
		endDate: new Date('1901-01-01T22:21:00.000Z'),
	},
	{
		theatreId: 1,
		movieId: 4,
		price: 5,
		startDate: new Date('1901-01-01T23:00:00.000Z'),
		endDate: new Date('1901-01-01T00:08:00.000Z'),
	},
];
