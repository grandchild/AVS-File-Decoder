import { z } from 'zod';

const TRANS_GROUP = z.literal('Trans');
const HEX_COLOR = z.string().regex(/^#[0-9A-F]{6}$/);

// JavaScript uses a 64-bit double-precision format to represent numbers, and integers larger than
// 2^53 (about 9 quadrillion) may lose precision. In your case, the number is within this safe range.
const INT64MAX = z.literal(Number('9223372036854775807'));

const RANGE_0_255 = z.number().int().min(0).max(255);
const RANGE_0_256 = z.number().int().min(0).max(256);
const RANGE_0_8 = z.number().int().min(0).max(8);
const RANGE_0_16 = z.number().int().min(0).max(16);
const RANGE_0_64 = z.number().int().min(0).max(64);
const RANGE_0_92 = z.number().int().min(0).max(92);
const RANGE_0_100 = z.number().int().min(0).max(100);
const RANGE_0_200 = z.number().int().min(0).max(200);
const RANGE_1_5 = z.number().int().min(1).max(5);
const RANGE_1_6 = z.number().int().min(1).max(6);
const RANGE_1_64 = z.number().int().min(1).max(64);
const RANGE_1_100 = z.number().int().min(1).max(100);
const RANGE_1_1024 = z.number().int().min(1).max(1024);
const RANGE_2_10 = z.number().int().min(2).max(10);
const RANGE_10_100 = z.number().int().min(10).max(100);
const RANGE_32_32 = z.number().int().min(-32).max(32);
const RANGE_31_225 = z.number().int().min(-31).max(225);
const RANGE_100_2000 = z.number().int().min(100).max(2000);
const RANGE_4096_4096 = z.number().int().min(-4096).max(4096);
const RANGE_0_01_1_28 = z.number().min(0.01).max(1.28);
const RANGE_INT16MIN_INT16MAX = z.number().int().min(-32_767).max(3_2767);

export const blitterFeedback = z.object({
	type: z.literal('BlitterFeedback'),
	group: z.literal('Misc'), // FIXME should be TRANS_GROUP,
	zoom: RANGE_0_256,
	onBeatZoom: RANGE_0_256,
	// blendMode: REPLACE, // TODO
	onBeat: z.boolean(),
	bilinear: z.boolean()
}).required();

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

export const bump = z.object({
	type: z.literal('Bump'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	onBeat: z.boolean(),
	duration: RANGE_0_100,
	depth: RANGE_1_100,
	onBeatDepth: RANGE_1_100,
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify
	code: z.object({
		init: z.string(), // TODO maxlength?
		perFrame: z.string(), // TODO maxlength?
		onBeat: z.string() // TODO maxlength?
	}),
	showDot: z.boolean(),
	invertDepth: z.boolean(),
	depthBuffer: RANGE_0_8
}).required();

export const channelShift = z.object({
	type: z.literal('ChannelShift'),
	group: TRANS_GROUP,
	mode: z.union([
		z.literal('BGR'),
		z.literal('BRG'),
		z.literal('GBR'),
		z.literal('GRB'),
		z.literal('RBG'),
		z.literal('RGB')
	]),
	onBeatRandom: z.boolean()
}).required();

export const colorClip = z.object({
	type: z.literal('ColorClip'),
	group: TRANS_GROUP,
	mode: z.union([
		z.literal('ABOVE'),
		z.literal('BELOW'),
		z.literal('NEAR')
	]),
	color: HEX_COLOR,
	outColor: HEX_COLOR,
	level: RANGE_0_64
}).required();

export const colorMap = z.object({
	type: z.literal('ColorMap'),
	group: TRANS_GROUP,
	// key: RED,
	// blendMode: REPLACE,
	// mapCycleMode: SINGLE,
	adjustBlend: RANGE_0_255,
	dontSkipFastBeats: z.boolean(),
	// cycleSpeed: 8,
	maps: z.array(
		z.object({
			// index: RANGE_0_255,
			enabled: z.boolean(),
			colors: z.array(
				z.object({
					color: HEX_COLOR,
					position: RANGE_0_255
				}),
				z.object({
					color: HEX_COLOR,
					position: RANGE_0_255
				})
			),
			// id: 94483456,
			fileName: z.string().max(260), // PS: Windows 10 allows 32,767
		})
	)
}).required();

export const colorModifier = z.object({
	type: z.literal('ColorModifier'),
	group: TRANS_GROUP,
	recomputeEveryFrame: z.boolean(),
	code: z.object({
		init: z.string(),
		perFrame: z.string(),
		onBeat: z.string(),
		perPoint: z.string()
	})
}).required();

export const colorReduction = z.object({
	type: z.literal('ColorReduction'),
	group: TRANS_GROUP,
	colors: z.union([
		z.literal(2),
		z.literal(4),
		z.literal(8),
		z.literal(16),
		z.literal(32),
		z.literal(64),
		z.literal(128),
		z.literal(256)
	])
}).required();

export const colorfade = z.object({
	type: z.literal('Colorfade'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	onBeat: z.boolean(),
	onBeatRandom: z.boolean(),
	fader1: RANGE_32_32,
	fader2: RANGE_32_32,
	fader3: RANGE_32_32,
	beatFader1: RANGE_32_32,
	beatFader2: RANGE_32_32,
	beatFader3: RANGE_32_32
}).required();

export const convolutionFilter = z.object({
	type: z.literal('ConvolutionFilter'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	edgeMode: z.union([
		z.literal('EXTEND'),
		z.literal('WRAP')
	]), // TODO verify
	absolute: z.boolean(),
	twoPass: z.boolean(),
	kernel: z.object({
		width: z.literal(7), // TODO can this change?
		height: z.literal(7), // TODO can this change?
		data: RANGE_INT16MIN_INT16MAX.array().length(49)
	}),
	bias: RANGE_INT16MIN_INT16MAX,
	scale: RANGE_INT16MIN_INT16MAX
}).required();

export const dynamicDistanceModifier = z.object({
	type: z.literal('DynamicDistanceModifier'),
	group: TRANS_GROUP,
	code: z.object({
		init: z.string(),
		perFrame: z.string(),
		onBeat: z.string(),
		perPoint: z.string()
	}),
	// blendMode: REPLACE, // TODO
	bilinear: z.boolean()
}).required();

export const dynamicMovement = z.object({
	type: z.literal('DynamicMovement'),
	group: TRANS_GROUP,
	code: z.object({
		init: z.string(),
		perFrame: z.string(),
		onBeat: z.string(),
		perPoint: z.string()
	}),
	bFilter: z.boolean(),
	coord: z.union([
		z.literal('CARTESIAN'),
		z.literal('POLAR')
	]), // TODO verify
	gridW: INT64MAX,
	gridH: INT64MAX,
	blend: z.boolean(),
	wrap: z.boolean(),
	buffer: RANGE_0_8, // TODO verify: 43?,
	alphaOnly: z.boolean()
}).required();

export const dynamicShift = z.object({
	type: z.literal('DynamicShift'),
	group: TRANS_GROUP,
	code: z.object({
		init: z.string(),
		perFrame: z.string(),
		onBeat: z.string(),
		perPoint: z.string()
	}),
	// blendMode: REPLACE, // TODO
	bilinear: z.boolean()
}).required();

export const fadeOut = z.object({
	type: z.literal('FadeOut'),
	group: TRANS_GROUP,
	speed: RANGE_0_92,
	color: HEX_COLOR
}).required();

export const fastBrightness = z.object({
	type: z.literal('FastBrightness'),
	group: TRANS_GROUP,
	factor: z.union([
		z.literal(0.5),
		z.literal(1),
		z.literal(2)
	])
}).required();

export const grain = z.object({
	type: z.literal('Grain'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify
	amount: RANGE_0_100,
	static: z.boolean()
}).required();

export const interferences = z.object({
	type: z.literal('Grain'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	numberOfLayers: RANGE_0_8,
	distance: RANGE_1_64,
	alpha: RANGE_0_255,
	rotation: RANGE_32_32,
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify
	onBeatDistance: RANGE_1_64,
	onBeatAlpha: RANGE_0_255,
	onBeatRotation: RANGE_32_32,
	separateRGB: z.boolean(),
	onBeat: z.boolean(),
	speed: RANGE_0_01_1_28
}).required();

export const interleave = z.object({
	type: z.literal('Interleave'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	x: RANGE_0_64,
	y: RANGE_0_64,
	color: HEX_COLOR,
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify
	onbeat: z.boolean(),
	x2: RANGE_0_64,
	y2: RANGE_0_64,
	beatDuration: RANGE_0_64
}).required();

export const invert = z.object({
	type: z.literal('Invert'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
}).required();

export const mirror = z.object({
	type: z.literal('Mirror'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	topToBottom: z.boolean(),
	bottomToTop: z.boolean(),
	leftToRight: z.boolean(),
	rightToLeft: z.boolean(),
	onBeatRandom: z.boolean(),
	smoothTransition: z.boolean(),
	transitionDuration: RANGE_0_16
}).required();

export const mosaic = z.object({
	type: z.literal('Mosaic'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	squareSize: RANGE_1_100,
	onBeatSquareSize: RANGE_1_100,
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify
	onBeatSizeChange: z.boolean(),
	onBeatSizeDuration: RANGE_1_100
}).required();

export const movement = z.object({
	type: z.literal('Movement'),
	group: TRANS_GROUP,
	builtinEffect: z.union([
		z.literal('Slight Fuzzify'),
		z.literal('Shift Rotate Left'),
		z.literal('Big Swirl Out'),
		z.literal('Medium Swirl'),
		z.literal('Sunburster'),
		z.literal('Swirl To Center'),
		z.literal('Blocky, Partial Out'),
		z.literal('Swirling Around Both Ways At Once'),
		z.literal('Bubbling Outward'),
		z.literal('Bubbling Outward With Swirl'),
		z.literal('5 Pointed Distro'),
		z.literal('Tunneling'),
		z.literal('Bleedin'),
		z.literal('Shifted Big Swirl Out'),
		z.literal('Psychotic Beaming Outward'),
		z.literal('Cosine Radial 3-way'),
		z.literal('Spinny Tube'),
		z.literal('Radial Swirlies'),
		z.literal('Swill'),
		z.literal('Gridley'),
		z.literal('Grapevine'),
		z.literal('Quadrant'),
		z.literal('6-way Kaleida'),
	]),
	output: z.union([
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]),
	sourceMapped: z.boolean(),
	coordinates: z.union([
		z.literal('CARTESIAN'),
		z.literal('POLAR')
	]), // TODO verify,
	bilinear: z.boolean(),
	wrap: z.boolean(),
	code: z.string()
}).required();

export const multiDelay = z.object({
	type: z.literal('MultiDelay'),
	group: TRANS_GROUP,
	mode: z.union([
		z.literal('DISABLED'),
		z.literal('INPUT'),
		z.literal('OUTPUT'),
	]),
	activeBuffer: RANGE_1_5, // TODO verify
	useBeats0: z.boolean(),
	delay0: RANGE_1_6, //	TODO verify
	useBeats1: z.boolean(),
	delay1: RANGE_1_6, //	TODO verify,
	useBeats2: z.boolean(),
	delay2: RANGE_1_6, //	TODO verify,
	useBeats3: z.boolean(),
	delay3: RANGE_1_6, //	TODO verify,
	useBeats4: z.boolean(),
	delay4: RANGE_1_6, //	TODO verify,
	useBeats5: z.boolean(),
	delay5: RANGE_1_6 //	TODO verify
}).required();

export const multiFilter = z.object({
	type: z.literal('MultiFilter'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	effect: z.union([
		z.literal('CHROME'),
		z.literal('DOUBLE_CHROME'),
		z.literal('INFINITE_ROOT_MULTIPLIER_AND_SMALL_BORDER_CONVOLUTION'),
		z.literal('TRIPLE_CHROME'),
	]),
	onBeat: z.boolean()
}).required();

export const rotoBlitter = z.object({
	type: z.literal('RotoBlitter'),
	group: TRANS_GROUP,
	zoom: RANGE_31_225,
	rotate: RANGE_32_32,
	blendMode: z.union([
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]),
	onBeatReverse: z.boolean(),
	reversalSpeed: RANGE_0_8,
	onBeatZoom: RANGE_31_225,
	onBeat: z.boolean(),
	bilinear: z.boolean()
}).required();

export const scatter = z.object({
	type: z.literal('Scatter'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
}).required();

export const texer = z.object({
	type: z.literal('Texer'),
	group: TRANS_GROUP,
	image: z.string().max(260), // PS: Windows 10 allows 32,767,
	// input: REPLACE, // TODO
	// blendMode: MASKED_TEXTURE, // TODO
	particles: RANGE_1_1024
}).required();

export const uniqueTone = z.object({
	type: z.literal('UniqueTone'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	color: HEX_COLOR,
	blendMode: z.union([
		z.literal('ADDITIVE'),
		z.literal('FIFTY_FIFTY'),
		z.literal('REPLACE')
	]), // TODO verify,
	invert: z.boolean()
}).required();

export const videoDelay = z.object({
	type: z.literal('VideoDelay'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	useBeats: z.boolean(),
	delay: RANGE_0_200
}).required();

export const waterBump = z.object({
	type: z.literal('WaterBump'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
	density: RANGE_2_10,
	depth: RANGE_100_2000,
	random: z.boolean(),
	// dropPositionX: 1, // TODO
	// dropPositionY: 1, // TODO
	dropRadius: RANGE_10_100,
	// method: 0 // TODO
}).required();

export const water = z.object({
	type: z.literal('Water'),
	group: TRANS_GROUP,
	enabled: z.boolean(),
}).required();

export type BlitterFeedback = z.infer<typeof blitterFeedback>;
export type Blur = z.infer<typeof blur>;
export type Brightness = z.infer<typeof brightness>;
export type Bump = z.infer<typeof bump>;
export type ChannelShift = z.infer<typeof channelShift>;
export type ColorClip = z.infer<typeof colorClip>;
export type ColorMap = z.infer<typeof colorMap>;
export type ColorModifier = z.infer<typeof colorModifier>;
export type ColorReduction = z.infer<typeof colorReduction>;
export type ConvolutionFilter = z.infer<typeof convolutionFilter>;
export type DynamicDistanceModifier = z.infer<typeof dynamicDistanceModifier>;
export type DynamicMovement = z.infer<typeof dynamicMovement>;
export type DynamicShift = z.infer<typeof dynamicShift>;
export type FadeOut = z.infer<typeof fadeOut>;
export type FastBrightness = z.infer<typeof fastBrightness>;
export type Grain = z.infer<typeof grain>;
export type Interferences = z.infer<typeof interferences>;
export type Interleave = z.infer<typeof interleave>;
export type Invert = z.infer<typeof invert>;
export type Mirror = z.infer<typeof mirror>;
export type Mosaic = z.infer<typeof mosaic>;
export type Movement = z.infer<typeof movement>;
export type MultiDelay = z.infer<typeof multiDelay>;
export type MultiFilter = z.infer<typeof multiFilter>;
export type RotoBlitter = z.infer<typeof rotoBlitter>;
export type Scatter = z.infer<typeof scatter>;
export type Texer = z.infer<typeof texer>;
export type UniqueTone = z.infer<typeof uniqueTone>;
export type VideoDelay = z.infer<typeof videoDelay>;
export type WaterBump = z.infer<typeof waterBump>;
export type Water = z.infer<typeof water>;

export type TransEffects =
	| BlitterFeedback
	| Blur
	| Brightness
	| Bump
	| ChannelShift
	| ColorClip
	| ColorMap
	| ColorModifier
	| Colorfade
	| ConvolutionFilter
	| DynamicDistanceModifier
	| DynamicMovement
	| DynamicShift
	| FadeOut
	| FastBrightness
	| Grain
	| Interferences
	| Interleave
	| Invert
	| Mirror
	| Mosaic
	| Movement
	| MultiDelay
	| MultiFilter
	| RotoBlitter
	| Scatter
	| Texer
	| UniqueTone
	| VideoDelay
	| WaterBump
	| Water
;
