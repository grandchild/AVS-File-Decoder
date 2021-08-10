// Modules
import { promises as fs } from 'fs';

async function getISOTime(file: string): Promise<string> {
    const time = await fs.stat(file);

    return time.mtime.toISOString();
}

async function readPreset(file: string): Promise<Buffer> {
    return await fs.readFile(file);
}

export {
    getISOTime,
    readPreset
};
