import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const plugins = [commonjs(), json()];

const compilerOptions = {
    allowSyntheticDefaultImports: true,
    moduleResolution: 'node',
    typeRoots: ['./types', './node_modules/@types']
};

const external = ['chalk', 'fs', 'path'];

export default [
    // CommonJS
    {
        external,
        input: 'src/browser.ts',
        output: {
            file: 'dist/browser.cjs',
            format: 'cjs'
        },
        plugins: [...plugins, typescript(compilerOptions)]
    },
    {
        external,
        input: 'src/node.ts',
        output: {
            file: 'dist/node.cjs',
            format: 'cjs'
        },
        plugins: [...plugins, typescript(compilerOptions)]
    },

    // ESM
    {
        external,
        input: 'src/browser.ts',
        output: {
            file: 'dist/browser.mjs',
            format: 'esm'
        },
        plugins: [
            ...plugins,
            typescript({
                ...compilerOptions,
                module: 'ES2020',
                moduleResolution: 'node'
            })
        ]
    },
    {
        external,
        input: 'src/node.ts',
        output: {
            file: 'dist/node.mjs',
            format: 'esm'
        },
        plugins: [
            ...plugins,
            typescript({
                ...compilerOptions,
                module: 'ES2020',
                moduleResolution: 'node'
            })
        ]
    }
];
