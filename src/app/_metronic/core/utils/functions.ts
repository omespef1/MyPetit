import Swal from 'sweetalert2';

export default function notify(
	html: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'info',
	duration: number = 1000
) {
	if (type === 'success') {
		Swal.fire({
			// position: 'top-end',
			icon: 'success',
			title: '¡Correcto!',
			html: html,
			showConfirmButton: false,
			timer: 1500,
		});
	} else if (type === 'error') {
		Swal.fire({
			icon: 'error',
			title: '¡Error!',
			html: html,
			showConfirmButton: true,
		});
	}
}
