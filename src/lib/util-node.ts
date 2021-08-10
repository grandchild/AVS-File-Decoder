// Modules
import { readFile, stat } from 'fs';

function getISOTime(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        stat(file, (err, time) => {
            err ? reject(err) : resolve(time.mtime.toISOString());
        });
    });
}

function readPreset(file: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        readFile(file, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

export {
    getISOTime,
    readPreset
};
