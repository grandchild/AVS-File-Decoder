import { z } from 'zod';

const MISC_GROUP = z.literal('Misc');
const RANGE_0_255 = z.number().int().min(0).max(255);

export const bufferSave = z.object({
	type: z.literal('BufferSave'),
	group: MISC_GROUP,
	action: z.union([
		z.literal('SAVE'),
		z.literal('RESTORE'),
		z.literal('ALTERNATE_SAVE_RESTORE'),
		z.literal('ALTERNATE_RESTORE_SAVE')
	]),
	bufferId: z.number().int().min(1).max(8),
	blendMode: z.union([
		z.literal('IGNORE'),
		z.literal('REPLACE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('MAXIMUM'),
		z.literal('ADDITIVE'),
		z.literal('SUB_DEST_SRC'),
		z.literal('SUB_SRC_DEST'),
		z.literal('EVERY_OTHER_LINE'),
		z.literal('EVERY_OTHER_PIXEL'),
		z.literal('XOR'),
		z.literal('ADJUSTABLE'),
		z.literal('MULTIPLY'),
		z.literal('BUFFER')
	]),
	adjustBlend: RANGE_0_255
}).required();

export const comment = z.object({
	type: z.literal('Comment'),
	group: MISC_GROUP,
	text: z.string()
}).required();

export const customBpm = z.object({
	type: z.literal('CustomBPM'),
	group: MISC_GROUP,
	enabled: z.boolean(),
	mode: z.union([
		z.literal('ARBITRARY'),
		z.literal('SKIP'),
		z.literal('REVERSE')
	]),
	arbitraryValue: RANGE_0_255,
	skipValue: RANGE_0_255,
	skipFirstBeats: RANGE_0_255
}).required();

export const setRenderMode = z.object({
	type: z.literal('SetRenderMode'),
	group: MISC_GROUP,
	blend: z.union([
		z.literal('BLEND_REPLACE'),
		z.literal('BLEND_ADDITIVE'),
		z.literal('BLEND_MAXIMUM'),
		z.literal('BLEND_5050'),
		z.literal('BLEND_SUB1'),
		z.literal('BLEND_SUB2'),
		z.literal('BLEND_MULTIPLY'),
		z.literal('BLEND_ADJUSTABLE'),
		z.literal('BLEND_XOR'),
		z.literal('BLEND_MINIMUM'),
	]),
	adjustBlend: RANGE_0_255,
	lineSize: RANGE_0_255,
	enabled: z.boolean()
}).required();

export type BufferSave = z.infer<typeof bufferSave>;
export type Comment = z.infer<typeof comment>;
export type CustomBpm = z.infer<typeof customBpm>;
export type SetRenderMode = z.infer<typeof setRenderMode>;

export type MiscEffects = BufferSave | Comment | CustomBpm | SetRenderMode;
