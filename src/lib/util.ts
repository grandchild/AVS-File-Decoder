// Modules
import config from '../config';
import get from './get';
import Log from './log';

const setHiddenStrings = (value: boolean): void => {
    config.hiddenStrings = value;
};
let verbosity = 0;
const setVerbosity = (value: number): void => {
    verbosity = value;
};

class ConvertException implements Error {
    name = 'ConvertException';

    constructor(public message: string) {
        this.message = message;
    }

    toString(): string {
        return `${this.name} : ${this.message}`;
    }
}

function cmpBytes(arr: Uint8Array, offset: number, test: number[]): boolean {
    for (let i = 0; i < test.length; i++) {
        if (test[i] === null) {
            continue; // null means 'any value' - a letiable
        }
        if (arr[i + offset] !== test[i]) {
            return false;
        }
    }

    return true;
}

function printTable(name: string, table: any): void {
    Log.log(`${name}:`);
    for (const key in table) {
        Log.log(`\t${key}: ${table[key] ? ('' + table[key]).replace(/\n/g, '\n\t\t') : 'undefined'}`);
    }
}

function callFunction(funcName: string, blobOrValue: JSONPrimitive | Uint8Array, offset?: void | number, extra?: unknown | void): any {
    try {
        if (blobOrValue instanceof Uint8Array) {
            return get[funcName](blobOrValue, offset, extra);
        } else {
            return get[funcName](blobOrValue);
        }
    } catch (e) {
        if (e.message.search(/not a function|has no method/) >= 0) {
            throw new ConvertException(`Method or table '${'get' + funcName}' was not found. Correct capitalization?`);
        } else {
            throw e;
        }
    }
}

function removeSpaces(str: string): string {
    return str.replace(/[ ]/g, '');
}

function lowerInitial(str: string): string {
    return str[0].toLowerCase() + str.slice(1);
}
export { callFunction, cmpBytes, ConvertException, lowerInitial, printTable, removeSpaces, setHiddenStrings, setVerbosity };
