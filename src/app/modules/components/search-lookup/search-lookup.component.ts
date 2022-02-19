import {
	Component,
	DoCheck,
	Input,
	OnInit,
	Self,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
} from 'rxjs/operators';

@Component({
	selector: 'search-lookup',
	templateUrl: './search-lookup.component.html',
	styleUrls: ['./search-lookup.component.scss'],
})
export class SearchLookupComponent
	implements OnInit, DoCheck, ControlValueAccessor
{
	@Input() label = '';
	@Input() formatter = (x: any) => x;
	@Input() result_formatter = (x: any) => x;
	@Input() set data(data: any[]) {
		this._data = data;
		this.writeValue(this.writed_value);
	}
	@Input() propertyText: string;
	@Input() propertyValue: string;
	@Input() name: string = '#ctrl';
	@Input() resultTemplate: TemplateRef<any>;
	@Input() placeholder = '';
	@Input() label_bold = false;
	private _data: any[] = [];
	onChange = (value: any) => {};
	onTouched = () => {};
	writting = false;
	writed_value: any;
	formControl: FormControl;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();
	@ViewChild('instance', { static: true }) instance: NgbTypeahead;

	search = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(
			debounceTime(200),
			distinctUntilChanged()
		);
		const clicksWithClosedPopup$ = this.click$.pipe(
			filter(() => this.instance && !this.instance.isPopupOpen())
		);
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term) => {

				// console.log(term);
				return (
					term === ''
						? this._data
						: this._data.filter(
								(v) =>
									v[this.propertyText]
										?.toLowerCase()
										.indexOf(term?.toLowerCase()) > -1
						  )
				)?.slice(0, 10);
			})
		);
	};

	constructor(@Self() public controlDir: NgControl) {
		this.formControl = new FormControl(controlDir.name);
		controlDir.valueAccessor = this;
	}

	ngOnInit(): void {
		this.formControl.setValidators(this.controlDir.control.validator);
	}

	ngDoCheck() {
		if (this.formControl && this.formControl.touched) {
			return;
		}
		if (this.controlDir.control && this.controlDir.control.touched) {
			this.formControl.markAsTouched();
		}
	}

	changeData(e) {
		if (!e) this.writeValue(undefined);
	}

	writeValue(value: any): void {
		if (!this.writting) {
			this.writed_value = value;
			// console.log('write value:', value);
			this.writting = true;

			const item = this.propertyValue
				? this._data?.find((m) => m[this.propertyValue] === value)
				: this._data?.find((m) => m === value);

			this.formControl.setValue(item);
			this.onChange(value);
			this.writting = false;
		}
	}

	selectItem(event: any) {
		// console.log('select: ', event);
		let svalue = this.propertyValue
			? event.item[this.propertyValue]
			: event.item;
		this.formControl.setValue(svalue);
		this.onChange(svalue);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.formControl.disable() : this.formControl.enable();
	}
}
