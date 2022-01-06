import Swal from 'sweetalert2';

export default function question(text: string) {
	const swal = Swal.fire({
		title: 'COMMON.ARE_YOU_SURE',
		text: text,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3699FF',
		cancelButtonColor: '#F64E60',
		confirmButtonText: 'COMMON.YES',
		cancelButtonText: 'COMMON.CANCEL',
	});
	swal.then((res) => {
		if (res.isConfirmed) {
			Swal.showLoading();
		}
	});

	return swal;
}
