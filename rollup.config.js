import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [commonjs(), json(), typescript()];
const external = ['chalk', 'fs', 'path'];

export default [
    {
        external,
        input: 'src/browser.ts',
        output: {
            file: 'dist/browser.mjs',
            format: 'esm',
            sourcemap: true
        },
        plugins
    },
    {
        external,
        input: 'src/node.ts',
        output: {
            file: 'dist/node.mjs',
            format: 'esm',
            sourcemap: true
        },
        plugins
    }
];
