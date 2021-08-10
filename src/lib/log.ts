import logSymbols from 'log-symbols';

const isNode = new Function('try {return this===global;}catch(e){return false;}');

export default {
    log(message: string): void {
        console.log(message);
    },

    info(message: string): void {
        console.info((isNode) ? (logSymbols.info, message) : message);
    },

    error(message: string): void {
        console.error((isNode) ? (logSymbols.error, message) : message);
    },

    success(message: string): void {
        console.log((isNode) ? (logSymbols.success, message) : message);
    },

    warn(message: string): void {
        console.warn((isNode) ? (logSymbols.warning, message) : message);
    },
}
