import typescript from '@rollup/plugin-typescript';

export default {
		external: [
				'json5',
				'node:os'
		],
		input: 'src/main.ts',
		output: {
				file: 'dist/webvsc.mjs',
				format: 'esm',
				sourcemap: true
		},
		plugins: [
				typescript()
		]
};
