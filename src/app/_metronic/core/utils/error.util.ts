export class ErrorUtil {
	static getMessage(err: any) {
		console.log('ErrorUtil: ', err);

		if (err.error?.Errors) {
			return (<String[]>err.error.Errors).join('<br>');
		}

		if (err.error) {
			return err.error.Description;
		}

		if (err.error?.trace) {
			return err.error.trace;
		}

		return err.message;
	}
}
