import { z } from 'zod';

const RENDER_GROUP = z.literal('Render');
const HEX_COLOR = z.string().regex(/^#[0-9A-F]{6}$/);
const HEX_COLORS_16 = HEX_COLOR.array().min(1).max(16);
const RANGE_0_32 = z.number().int().min(0).max(32);
const RANGE_1_64 = z.number().int().min(1).max(64);
const RANGE_1_100 = z.number().int().min(1).max(100);
const RANGE_16_16 = z.number().int().min(-16).max(16);
const RANGE_50_50 = z.number().int().min(-50).max(50);
const RANGE_100_4095 = z.number().int().min(100).max(4095);
const RANGE_16_576 = z.number().int().min(16).max(576);
const RANGE_ANGLE = z.number().int().min(-90).max(91);
const POSITIONS_HORIZONTAL = z.union([
	z.literal('LEFT'),
	z.literal('RIGHT'),
	z.literal('CENTER'),
]);
const POSITIONS_VERTICAL = z.union([
	z.literal('TOP'),
	z.literal('BOTTOM'),
	z.literal('CENTER'),
]);
const NUMBERIC_BOOLEAN = z.union([
	z.literal(0),
	z.literal(1),
]);

export const bassSpin = z
	.object({
		type: z.literal('BassSpin'),
		group: RENDER_GROUP,
		enabledLeft: z.boolean(),
		enabledRight: z.boolean(),
		colorLeft: HEX_COLOR,
		colorRight: HEX_COLOR,
		mode: z.union([z.literal('LINES'), z.literal('TRIANGLES')]),
	})
	.required();

export const clearScreen = z
	.object({
		type: z.literal('ClearScreen'),
		group: RENDER_GROUP,
		enabled: z.boolean(),
		color: HEX_COLOR,
		blendMode: z.union([z.literal('ADDITIVE'), z.literal('DEFAULT'), z.literal('FIFTY_FIFTY')]),
		onlyFirst: z.boolean(),
	})
	.required();

export const dotFountain = z
	.object({
		type: z.literal('DotFountain'),
		group: RENDER_GROUP,
		rotationSpeed: RANGE_50_50,
		colorTop: HEX_COLOR,
		colorHigh: HEX_COLOR,
		colorMid: HEX_COLOR,
		colorLow: HEX_COLOR,
		colorBottom: HEX_COLOR,
		angle: RANGE_ANGLE,
	})
	.required();

export const dotGrid = z
	.object({
		type: z.literal('DotGrid'),
		group: RENDER_GROUP,
		colors: HEX_COLORS_16,
		spacing: z.number().int().min(0).safe(), // TODO validate 0, UINT32_MAX
		speedX: RANGE_16_16,
		speedY: RANGE_16_16,
		blendMode: z.union([
			z.literal('REPLACE'),
			z.literal('ADDITIVE'),
			z.literal('FIFTY_FIFTY'),
			z.literal('DEFAULT'),
		]), // TODO dry
	})
	.required();

export const dotPlane = z
	.object({
		type: z.literal('DotPlane'),
		group: RENDER_GROUP,
		rotationSpeed: RANGE_50_50,
		colorTop: HEX_COLOR,
		colorHigh: HEX_COLOR,
		colorMid: HEX_COLOR,
		colorLow: HEX_COLOR,
		colorBottom: HEX_COLOR,
		angle: RANGE_ANGLE,
	})
	.required();

export const movingParticle = z
	.object({
		type: z.literal('MovingParticle'),
		group: RENDER_GROUP,
		enabled: z.boolean(),
		onBeatSizeChange: z.boolean(),
		color: HEX_COLOR,
		distance: z.number().int().min(1).max(32),
		particleSize: z.number().int().min(1).max(128), // TODO dry
		onBeatParticleSize: z.number().int().min(1).max(128), // TODO dry
		blendMode: z.union([
			z.literal('REPLACE'),
			z.literal('ADDITIVE'),
			z.literal('FIFTY_FIFTY'),
			z.literal('DEFAULT'),
		]), // TODO dry
	})
	.required();

export const onBeatClear = z
	.object({
		type: z.literal('OnBeatClear'),
		group: RENDER_GROUP,
		color: HEX_COLOR,
		blendMode: z.union([z.literal('REPLACE'), z.literal('FIFTY_FIFTY')]),
		clearBeats: z.number().int().min(0).max(100),
	})
	.required();

export const oscilliscopeStar = z
	.object({
		type: z.literal('OscilliscopeStar'),
		group: RENDER_GROUP,
		audioChannel: POSITIONS_HORIZONTAL,
		positionX: POSITIONS_HORIZONTAL,
		colors: HEX_COLORS_16,
		size: RANGE_0_32,
		rotation: RANGE_16_16
	})
	.required();

export const ring = z
	.object({
		type: z.literal('Ring'),
		group: RENDER_GROUP,
		audioChannel: POSITIONS_HORIZONTAL,
		positionX: POSITIONS_HORIZONTAL,
		colors: HEX_COLORS_16,
		size: RANGE_1_64
	})
	.required();

export const rotatingStars = z
	.object({
		type: z.literal('RotatingStars'),
		group: RENDER_GROUP,
		colors: HEX_COLORS_16
	})
	.required();

export const simple = z
	.object({
		type: z.literal('Simple'),
		group: RENDER_GROUP,
		audioSource: z.union([
			z.literal('Waveform'),
			z.literal('Spectrum'),
		]), // TODO dry, validate
		renderType: z.union([
			z.literal('Dots'),
			z.literal('Lines'),
			z.literal('Solid'),
		]), // TODO dry, validate
		audioChannel: POSITIONS_HORIZONTAL,
		positionY: POSITIONS_VERTICAL,
		colors: HEX_COLORS_16
	})
	.required();

export const starfield = z
	.object({
		type: z.literal('Starfield'),
		group: RENDER_GROUP,
		enabled: NUMBERIC_BOOLEAN,
		color: HEX_COLOR,
		blendMode: z.union([
			z.literal('REPLACE'),
			z.literal('ADDITIVE'),
			z.literal('FIFTY_FIFTY'),
		]),
		// WarpSpeed: 6, TODO
		MaxStars_set: RANGE_100_4095,
		onbeat: NUMBERIC_BOOLEAN,
		// spdBeat: 4, // TODO
		durFrames: RANGE_1_100
	})
	.required();

export const superScope = z
	.object({
		type: z.literal('SuperScope'),
		group: RENDER_GROUP,
		code: z.object({
			init: z.string(), // TODO maxlength?
			perFrame: z.string(), // TODO maxlength?
			onBeat: z.string(), // TODO maxlength?
			perPoint: z.string(), // TODO maxlength?
		}), // TODO dry
		audioChannel: POSITIONS_HORIZONTAL,
		audioSource: z.union([
			z.literal('WAVEFORM'),
			z.literal('SPECTRUM'),
		]),
		colors: HEX_COLORS_16,
		drawMode: z.union([
			z.literal('DOTS'),
			z.literal('LINES'),
		]), // TODO dry, validate
	})
	.required();

export const texer2 = z
	.object({
		type: z.literal('TexerII'),
		group: RENDER_GROUP,
		imageSrc: z.string().max(260), // Windows 10 allows 32,767
		resizing: z.boolean(),
		wrapAround: z.boolean(),
		colorFiltering: z.boolean(),
		code: z.object({
			init: z.string(), // TODO maxlength?
			perFrame: z.string(), // TODO maxlength?
			onBeat: z.string(), // TODO maxlength?
			perPoint: z.string(), // TODO maxlength?
		}), // TODO dry
	})
	.required();

export const text = z
	.object({
		type: z.literal('Text'),
		group: RENDER_GROUP,
		enabled: z.boolean(),
		color: HEX_COLOR,
		// blendMode: REPLACE,
		onBeat: z.boolean(),
		insertBlanks: z.boolean(),
		randomPosition: z.boolean(),
		// verticalAlign: CENTER,
		// horizontalAlign: CENTER,
		// onBeatSpeed: 15,
		// normSpeed: 15,
		// weight: DONTCARE,
		italic: z.boolean(),
		underline: z.boolean(),
		strikeOut: z.boolean(),
		// charSet: 0,
		fontName: z.string(), // TODO maxlength?
		text: z.string(), // TODO maxlength?
		outline: z.boolean(),
		outlineColor: HEX_COLOR,
		// shiftX: 0,
		// shiftY: 0,
		// outlineShadowSize: 1,
		randomWord: z.boolean(),
		shadow: z.boolean()
	})
	.required();

export const timescope = z
	.object({
		type: z.literal('Timescope'),
		group: RENDER_GROUP,
		enabled: z.boolean(),
		color: HEX_COLOR,
		blendMode: z.union([
			z.literal('REPLACE'),
			z.literal('ADDITIVE'),
			z.literal('FIFTY_FIFTY'),
			z.literal('DEFAULT'),
		]), // TODO dry,
		bands: RANGE_16_576
	})
	.required();

export type BassSpin = z.infer<typeof bassSpin>;
export type ClearScreen = z.infer<typeof clearScreen>;
export type DotFountain = z.infer<typeof dotFountain>;
export type DotGrid = z.infer<typeof dotGrid>;
export type DotPlane = z.infer<typeof dotPlane>;
export type MovingParticle = z.infer<typeof movingParticle>;
export type OnBeatClear = z.infer<typeof onBeatClear>;
export type OscilliscopeStar = z.infer<typeof oscilliscopeStar>;
export type Ring = z.infer<typeof ring>;
export type RotatingStars = z.infer<typeof rotatingStars>;
export type Simple = z.infer<typeof simple>;
export type Starfield = z.infer<typeof starfield>;
export type SuperScope = z.infer<typeof superScope>;
export type Texer2 = z.infer<typeof texer2>;
export type Text = z.infer<typeof text>;
export type Timescope = z.infer<typeof timescope>;

export type RenderEffects =
	| BassSpin
	| ClearScreen
	| DotFountain
	| DotGrid
	| DotPlane
	| MovingParticle
	| OnBeatClear
	| OscilliscopeStar
	| Ring
	| RotatingStars
	| Simple
	| Starfield
	| SuperScope
	| Texer2
	| Text
	| Timescope
;
