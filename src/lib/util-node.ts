// Modules
import { readFile, stat } from 'fs';

const getISOTime = (file: string): any => {
    return new Promise( (resolve, reject) => {
        stat(file, (err, time) => {
           err ? reject(err) : resolve(time.mtime.toISOString());
        });
    });
};

const readPreset = (file: string): any => {
    return new Promise( (resolve, reject) => {
        readFile(file, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

export {
    getISOTime,
    readPreset
};
