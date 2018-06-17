import chalk from 'chalk';

const dim = (message: string): void => {
    console.log((isNode) ? chalk.dim(message) : message);
};

const error = (message: string): void => {
    console.error((isNode) ? chalk.red(message) : message);
};

const warn = (message: string): void => {
    console.warn((isNode) ? chalk.yellow(message) : message);
};

const isNode = new Function('try {return this===global;}catch(e){return false;}');

export {
    dim,
    error,
    warn
};
