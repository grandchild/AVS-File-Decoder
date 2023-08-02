import logSymbols from 'log-symbols';

export default {
		log(message: string): void {
				console.log(message);
		},

		info(message: string): void {
				console.info(logSymbols.info, message);
		},

		error(message: string): void {
				console.error(logSymbols.error, message);
		},

		success(message: string): void {
				console.log(logSymbols.success, message);
		},

		warn(message: string): void {
				console.warn(logSymbols.warning, message);
		}
};
