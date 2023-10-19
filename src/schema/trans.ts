import { z } from 'zod';

const TRANS_GROUP = z.literal('Trans');
const HEX_COLOR = z.string().regex(/^#[0-9A-F]{6}$/);
const RANGE_0_255 = z.number().int().min(0).max(255);
const RANGE_4096_4096 = z.number().int().min(-4096).max(4096);

export const blur = z.object({
	type: z.literal('Blur'),
	group: TRANS_GROUP,
	blur: z.union([
		z.literal('LIGHT'),
		z.literal('MEDIUM'),
		z.literal('Heavy')
	]),
	round: z.union([
		z.literal('DOWN'),
		z.literal('UP')
	])
}).required();

export const brightness = z.object({
	type: z.literal('Blur'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]),
	red: RANGE_4096_4096,
	green: RANGE_4096_4096,
	blue: RANGE_4096_4096,
	separate: z.boolean(),
	excludeColor: HEX_COLOR,
	exclude: z.boolean(),
	distance: RANGE_0_255
}).required();

// export type BlitterFeedback = z.infer<typeof blitterFeedback>;
export type Blur = z.infer<typeof blur>;
export type Brightness = z.infer<typeof brightness>;

export type TransEffects =
	// | BlitterFeedback
	| Blur
	| Brightness
	;
