import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-pic-select',
	templateUrl: './pic-select.component.html',
	styleUrls: ['./pic-select.component.scss'],
})
export class PicSelectComponent implements OnInit {
	@Input() pic: string;
	@Input() null_pic: string;
	@Output() changePic = new EventEmitter<string>();

	formGroup: FormGroup;

	constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.loadForm();
	}

	loadForm() {
		this.formGroup = this.fb.group({
			pic: [this.pic],
		});
	}

	fileChangeEvent(files: File[]) {
		var reader = new FileReader();
		reader.onload = (e: any) => {
			// console.log(e.target.result);
			this.pic = e.target.result;
			this.changePic.emit(this.pic);
			this.formGroup.controls.pic.setValue(e.target.result);
			this.cdr.detectChanges();
		};
		reader.readAsDataURL(files[0]);
	}

	getPic() {
		if (!this.pic) {
			if (this.null_pic) return `url(${this.null_pic})`;
			return `url('assets/media/icons/perro.png')`;
		}

		return `url('${this.pic}')`;
	}

	deletePic() {
		this.pic = '';
		this.formGroup.controls.pic.setValue('');
	}
}
