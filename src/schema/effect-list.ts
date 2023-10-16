import { z } from 'zod';

const RANGE_0_255 = z.number().int().min(0).max(255);
const BLEND_MODES = z.union([
	z.literal('IGNORE'),
	z.literal('REPLACE'),
	z.literal('5050'),
	z.literal('MAXIMUM'),
	z.literal('ADDITIVE'),
	z.literal('SUB_1'), // TODO verify
	z.literal('SUB_2'), // TODO verify
	z.literal('EVERY_OTHER_LINE'),
	z.literal('EVERY_OTHER_PIXEL'),
	z.literal('XOR'),
	z.literal('ADJUSTABLE'),
	z.literal('MULTIPLY'),
	z.literal('BUFFER'),
	z.literal('MINIMUM')
]);

export const effectList = z.object({
	type: z.literal('EffectList'),
	enabled: z.boolean(),
	clearFrame: z.boolean(),
	input: BLEND_MODES,
	output: BLEND_MODES,
	inAdjustBlend: RANGE_0_255,
	outAdjustBlend: RANGE_0_255,
	inBuffer: z.number().int().min(1).max(8),
	outBuffer: z.number().int().min(1).max(8),
	inBufferInvert: z.boolean(),
	outBufferInvert: z.boolean(),
	enableOnBeat: z.boolean(),
	enableOnBeatFor: z.number().int().min(0).safe(), // TODO validate
	code: z.object({
		enabled: z.boolean(),
		init: z.string(),
		perFrame: z.string()
	}),
	// TODO components: []
}).required();

export type EffectList = z.infer<typeof effectList>;
