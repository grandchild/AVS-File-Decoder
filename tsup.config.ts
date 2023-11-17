import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
  clean: true,
  dts: true,
  entry: [
		'src/webvsc.ts'
	],
	external: [
		'log-symbols',
		'zod'
	],
  format: 'esm',
  minify: true,
  treeshake: 'recommended'
});
