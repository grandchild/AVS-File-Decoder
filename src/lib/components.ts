import config from '../config';

const builtin: Webvsc.ComponentDefinition[] = [
		{
				name: 'Effect List', // builtin and r_list.cpp for extended Effect Lists
				code: 0xfffffffe,
				group: '',
				func: 'effectList'
		},
		{
				name: 'Simple', // r_simple.cpp
				code: 0x00,
				group: 'Render',
				func: 'simple'
		}, // ironically, this save format is too complicated for the generic decoder.
		{
				name: 'Dot Plane', // r_dotpln.cpp
				code: 0x01,
				group: 'Render',
				func: 'generic',
				fields: {
						rotationSpeed: 'Int32', // -50 to 50
						colorTop: 'Color',
						colorHigh: 'Color',
						colorMid: 'Color',
						colorLow: 'Color',
						colorBottom: 'Color',
						angle: 'Int32',
						null0: config.sizeInt // [see comment on dot fountan]
				}
		},
		{
				name: 'Oscilliscope Star', // r_oscstar.cpp
				code: 0x02,
				group: 'Render',
				func: 'generic',
				fields: {
						audioChannel: ['Bit', [2, 3], 'AudioChannel'],
						positionX: ['Bit', [4, 5], 'PositionX'],
						null0: config.sizeInt - 1,
						colors: 'ColorList',
						size: config.sizeInt,
						rotation: config.sizeInt
				}
		},
		{
				name: 'FadeOut', // r_fadeout.cpp
				code: 0x03,
				group: 'Trans',
				func: 'generic',
				fields: {
						speed: config.sizeInt, // 0-92, channelwise integer steps per frame towards target color
						color: 'Color'
				}
		},
		{
				name: 'Blitter Feedback', // r_blit.cpp
				code: 0x04,
				group: 'Misc',
				func: 'generic',
				fields: {
						zoom: config.sizeInt, // [position]: [factor] -> 0x00: 2, 0x20: 1, 0xA0: 0.5, 0x100: ~1/3
						onBeatZoom: config.sizeInt,
						blendMode: ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
						onBeat: ['Bool', config.sizeInt],
						bilinear: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'OnBeat Clear', // r_nfclr.cpp
				code: 0x05,
				group: 'Render',
				func: 'generic',
				fields: {
						color: 'Color',
						blendMode: ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
						clearBeats: config.sizeInt
				}
		},
		{
				name: 'Blur', // r_blur.cpp
				code: 0x06,
				group: 'Trans',
				func: 'generic',
				fields: {
						blur: ['Map4', { 0: 'NONE', 1: 'MEDIUM', 2: 'LIGHT', 3: 'HEAVY' }],
						round: ['Map4', { 0: 'DOWN', 1: 'UP' }]
				}
		},
		{
				name: 'Bass Spin', // r_bspin.cpp
				code: 0x07,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabledLeft: ['Bit', 0, 'Boolified'],
						enabledRight: ['Bit', 1, 'Boolified'],
						null0: config.sizeInt - 1, // fill up bitfield
						colorLeft: 'Color',
						colorRight: 'Color',
						mode: ['Map4', { 0: 'LINES', 1: 'TRIANGLES' }]
				}
		},
		{
				name: 'Moving Particle', // r_parts.cpp
				code: 0x08,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bit', 0, 'Boolified'],
						onBeatSizeChange: ['Bit', 1, 'Boolified'],
						null0: config.sizeInt - 1, // fill up bitfield
						color: 'Color',
						distance: config.sizeInt, // 1-32: min(h/2,w*(3/8))*distance/32.0
						particleSize: config.sizeInt, // 1-128
						onBeatParticleSize: config.sizeInt, // 1-128
						blendMode: ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }]
				}
		},
		{
				name: 'Roto Blitter',
				code: 0x09,
				group: 'Trans',
				func: 'generic',
				fields: {
						zoom: config.sizeInt,
						rotate: config.sizeInt,
						blendMode: ['Map4', { '0': 'REPLACE', '1': 'FIFTY_FIFTY' }],
						onBeatReverse: ['Bool', config.sizeInt],
						reversalSpeed: config.sizeInt, // inverted - 0: fastest, 8: slowest
						onBeatZoom: config.sizeInt,
						onBeat: ['Bool', config.sizeInt],
						bilinear: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'SVP', // r_svp.cpp
				code: 0x0a,
				group: 'Render',
				func: 'generic',
				fields: {
						library: ['SizeString', 260]
				}
		},
		{
				name: 'Colorfade', // r_colorfade.cpp
				code: 0x0b,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bit', 0, 'Boolified'],
						onBeat: ['Bit', 2, 'Boolified'], // i changed the order a bit here
						onBeatRandom: ['Bit', 1, 'Boolified'],
						null0: config.sizeInt - 1, // fill up bitfield
						fader1: 'Int32', // all faders go from -32 to 32
						fader2: 'Int32',
						fader3: 'Int32',
						beatFader1: 'Int32',
						beatFader2: 'Int32',
						beatFader3: 'Int32'
				}
		},
		{
				name: 'Color Clip', // r_contrast.cpp
				code: 0x0c,
				group: 'Trans',
				func: 'generic',
				fields: {
						mode: ['Map4', { 0: 'OFF', 1: 'BELOW', 2: 'ABOVE', 3: 'NEAR' }],
						color: 'Color',
						outColor: 'Color',
						level: config.sizeInt // 0-64: (d_r^2 + d_g^2 + d_b^2) <= (level*2)^2
				}
		},
		{
				name: 'Rotating Stars', // r_rotstar.cpp
				code: 0x0d,
				group: 'Render',
				func: 'generic',
				fields: {
						colors: 'ColorList'
				}
		},
		{
				name: 'Ring', // r_oscring.cpp
				code: 0x0e,
				group: 'Render',
				func: 'generic',
				fields: {
						audioChannel: ['Bit', [2, 3], 'AudioChannel'],
						positionX: ['Bit', [4, 5], 'PositionX'],
						null0: config.sizeInt - 1,
						colors: 'ColorList',
						size: config.sizeInt,
						audioSource: ['UInt32', config.sizeInt, 'AudioSource']
				}
		},
		{
				name: 'Movement', // r_trans.cpp
				code: 0x0f,
				group: 'Trans',
				func: 'movement'
		},
		{
				name: 'Scatter', // r_scat.cpp
				code: 0x10,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Dot Grid', // r_dotgrid.cpp
				code: 0x11,
				group: 'Render',
				func: 'generic',
				fields: {
						colors: 'ColorList',
						spacing: config.sizeInt,
						speedX: 'Int32', // -512 to 544
						speedY: 'Int32',
						blendMode: ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }]
				}
		},
		{
				name: 'Buffer Save', // r_stack.cpp
				code: 0x12,
				group: 'Misc',
				func: 'generic',
				fields: {
						action: ['BufferMode', config.sizeInt],
						bufferId: ['BufferNum', config.sizeInt],
						blendMode: ['BlendmodeBuffer', config.sizeInt],
						adjustBlend: config.sizeInt
				}
		},
		{
				name: 'Dot Fountain', // r_dotfnt.cpp
				code: 0x13,
				group: 'Render',
				func: 'generic',
				fields: {
						rotationSpeed: 'Int32', // -50 to 50
						colorTop: 'Color',
						colorHigh: 'Color',
						colorMid: 'Color',
						colorLow: 'Color',
						colorBottom: 'Color',
						angle: 'Int32',
						null0: config.sizeInt // most likely current rotation, has some huge value, has no ui, is basically arbitrary depending on time of save, not converted
				}
		},
		{
				name: 'Water', // r_water.cpp
				code: 0x14,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Comment', // r_comment.cpp
				code: 0x15,
				group: 'Misc',
				func: 'generic',
				fields: {
						text: 'SizeString'
				}
		},
		{
				name: 'Brightness', // r_bright.cpp
				code: 0x16,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						red: 'Int32', // \
						green: 'Int32', //  > -4096 to 4096
						blue: 'Int32', // /
						separate: ['Bool', config.sizeInt],
						excludeColor: 'Color',
						exclude: ['Bool', config.sizeInt],
						distance: config.sizeInt // 0 to 255
				}
		},
		{
				name: 'Interleave', // r_interleave.cpp
				code: 0x17,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						x: config.sizeInt,
						y: config.sizeInt,
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						onbeat: ['Bool', config.sizeInt],
						x2: config.sizeInt,
						y2: config.sizeInt,
						beatDuration: config.sizeInt
				}
		},
		{
				name: 'Grain', // r_grain.cpp
				code: 0x18,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						amount: config.sizeInt, // 0-100
						static: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Clear Screen', // r_clear.cpp
				code: 0x19,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
						onlyFirst: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Mirror', // r_mirror.cpp
				code: 0x1a,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						topToBottom: ['Bit', 0, 'Boolified'],
						bottomToTop: ['Bit', 1, 'Boolified'],
						leftToRight: ['Bit', 2, 'Boolified'],
						rightToLeft: ['Bit', 3, 'Boolified'],
						null0: config.sizeInt - 1, // fill up bitfield space
						onBeatRandom: ['Bool', config.sizeInt],
						smoothTransition: ['Bool', config.sizeInt],
						transitionDuration: config.sizeInt
				}
		},
		{
				name: 'Starfield', // r_stars.cpp
				code: 0x1b,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: config.sizeInt,
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						WarpSpeed: 'Float',
						MaxStars_set: config.sizeInt,
						onbeat: config.sizeInt,
						spdBeat: 'Float',
						durFrames: config.sizeInt
				}
		},
		{
				name: 'Text', // r_text.cpp
				code: 0x1c,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						onBeat: ['Bool', config.sizeInt],
						insertBlanks: ['Bool', config.sizeInt],
						randomPosition: ['Bool', config.sizeInt],
						verticalAlign: ['Map4', { '0': 'TOP', '4': 'CENTER', '8': 'BOTTOM' }],
						horizontalAlign: ['Map4', { '0': 'LEFT', '1': 'CENTER', '2': 'RIGHT' }],
						onBeatSpeed: config.sizeInt,
						normSpeed: config.sizeInt,
						null0: 60, // Win CHOOSEFONT structure, little relevance afaics
						// Win LOGFONT structure, 60bytes, this is more interesting:
						null1: config.sizeInt * 4, // LONG  lfHeight;
						// LONG  lfWidth;
						// LONG  lfEscapement;
						// LONG  lfOrientation;
						weight: config.sizeInt, // LONG  lfWeight;
						italic: ['Bool', 1], // BYTE  lfItalic;
						underline: ['Bool', 1], // BYTE  lfUnderline;
						strikeOut: ['Bool', 1], // BYTE  lfStrikeOut;
						charSet: 1, // too lazy, FIXME: 'charSet': ['Map4', {'0': 'Western', /*...*/}], // BYTE  lfCharSet;
						null2: 4, // BYTE  lfOutPrecision;
						// BYTE  lfClipPrecision;
						// BYTE  lfQuality;
						// BYTE  lfPitchAndFamily;
						fontName: ['SizeString', 32], // TCHAR lfFaceName[LF_FACESIZE];
						text: ['SizeString', 0 /*==var length*/, 'SemiColSplit'],
						outline: ['Bool', config.sizeInt],
						outlineColor: 'Color',
						shiftX: config.sizeInt,
						shiftY: config.sizeInt,
						outlineShadowSize: config.sizeInt,
						randomWord: ['Bool', config.sizeInt],
						shadow: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Bump', // r_bump.cpp
				code: 0x1d,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						onBeat: ['Bool', config.sizeInt],
						duration: config.sizeInt, // 0-100
						depth: config.sizeInt, // 0-100
						onBeatDepth: config.sizeInt, // 0-100
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						code: 'CodeFBI',
						showDot: ['Bool', config.sizeInt],
						invertDepth: ['Bool', config.sizeInt],
						null0: config.sizeInt,
						depthBuffer: ['BufferNum', config.sizeInt]
				}
		},
		{
				name: 'Mosaic', // r_mosaic.cpp
				code: 0x1e,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						squareSize: config.sizeInt,
						onBeatSquareSize: config.sizeInt,
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						onBeatSizeChange: ['Bool', config.sizeInt],
						onBeatSizeDuration: config.sizeInt
				}
		},
		{
				name: 'Water Bump', // r_waterbump.cpp
				code: 0x1f,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						density: config.sizeInt,
						depth: config.sizeInt,
						random: ['Bool', config.sizeInt],
						dropPositionX: config.sizeInt,
						dropPositionY: config.sizeInt,
						dropRadius: config.sizeInt,
						method: config.sizeInt
				}
		},
		{
				name: 'AVI', // r_avi.cpp
				code: 0x20,
				group: 'Trans',
				func: 'avi'
		},
		{
				name: 'Custom BPM', // r_bpm.cpp
				code: 0x21,
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						mode: ['RadioButton', { 0: 'ARBITRARY', 1: 'SKIP', 2: 'REVERSE' }],
						arbitraryValue: config.sizeInt,
						skipValue: config.sizeInt,
						skipFirstBeats: config.sizeInt // setting this to n>0 also prevents arbitrary mode from running on load of preset until n beats have passed.
				}
		},
		{
				name: 'Picture', // r_picture.cpp
				code: 0x22,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						adapt: config.sizeInt,
						onBeatPersist: config.sizeInt, // 0 to 32
						file: 'NtString',
						ratio: config.sizeInt,
						aspectRatioAxis: ['Map4', { 0: 'X', 1: 'Y' }]
				}
		},
		{
				name: 'Dynamic Distance Modifier', // r_ddm.cpp
				code: 0x23,
				group: 'Trans',
				func: 'versioned_generic',
				fields: {
						new_version: ['Bool', 1],
						code: 'CodePFBI',
						blendMode: ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
						bilinear: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Super Scope', // r_sscope.cpp
				code: 0x24,
				group: 'Render',
				func: 'versioned_generic',
				fields: {
						new_version: ['Bool', 1],
						code: 'CodePFBI',
						audioChannel: ['Bit', [0, 1], 'AudioChannel'],
						audioSource: ['Bit', 2, 'AudioSource'],
						null0: 3, // padding, bitfield before is actually 32 bit
						colors: 'ColorList',
						drawMode: ['DrawMode', config.sizeInt]
				}
		},
		{
				name: 'Invert', // r_invert.cpp
				code: 0x25,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Unique Tone', // r_onetone.cpp
				code: 0x26,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						invert: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Timescope', // r_timescope.cpp
				code: 0x27,
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						color: 'Color',
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
						audioChannel: ['UInt32', config.sizeInt, 'AudioChannel'],
						bands: config.sizeInt
				}
		},
		{
				name: 'Set Render Mode', // r_linemode.cpp
				code: 0x28,
				group: 'Misc',
				func: 'generic',
				fields: {
						blend: ['BlendmodeRender', 1],
						adjustBlend: 1,
						lineSize: 1,
						enabled: ['Bit', 7, 'Boolified']
				}
		},
		{
				name: 'Interferences', // r_interf.cpp
				code: 0x29,
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						numberOfLayers: config.sizeInt,
						null0: config.sizeInt, // current rotation, is virtually arbitrary - not converted
						distance: config.sizeInt, // 1 to 64
						alpha: config.sizeInt, // 1 to 255
						rotation: 'Int32', // 32 to -32 (ui has inverted range)
						blendMode: ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
						onBeatDistance: config.sizeInt,
						onBeatAlpha: config.sizeInt,
						onBeatRotation: config.sizeInt,
						separateRGB: ['Bool', config.sizeInt],
						onBeat: ['Bool', config.sizeInt],
						speed: 'Float' // 0.01 to 1.28
				}
		},
		{
				name: 'Dynamic Shift', // r_shift.cpp
				code: 0x2a,
				group: 'Trans',
				func: 'versioned_generic',
				fields: {
						new_version: ['Bool', 1],
						code: 'CodeIFB',
						blendMode: ['Map4', { 0: 'Replace', 1: 'FIFTY_FIFTY' }],
						bilinear: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Dynamic Movement', // r_dmove.cpp
				code: 0x2b,
				group: 'Trans',
				func: 'versioned_generic',
				fields: {
						new_version: ['Bool', 1],
						code: 'CodePFBI',
						bFilter: ['Bool', config.sizeInt],
						coord: ['Coordinates', config.sizeInt],
						gridW: config.sizeInt,
						gridH: config.sizeInt,
						blend: ['Bool', config.sizeInt],
						wrap: ['Bool', config.sizeInt],
						buffer: ['BufferNum', config.sizeInt],
						alphaOnly: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Fast Brightness', // r_fastbright.cpp
				code: 0x2c,
				group: 'Trans',
				func: 'generic',
				fields: {
						factor: ['Map4', { 0: 2, 1: 0.5, 2: 1 }]
				}
		},
		{
				name: 'Color Modifier', // r_dcolormod.cpp
				code: 0x2d,
				group: 'Trans',
				func: 'versioned_generic',
				fields: {
						new_version: ['Bool', 1],
						code: 'CodePFBI',
						recomputeEveryFrame: ['Bool', 4]
				}
		}
];

//// APEs
const dll: Webvsc.ComponentDefinition[] = [
		{
				name: 'AVS Trans Automation',
				// Misc: AVSTrans Automation.......
				code:
						// prettier-ignore
						[
								0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56,
								0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41,
								0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F,
								0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						logging: ['Bool', config.sizeInt],
						translateFirstLevel: ['Bool', config.sizeInt],
						readCommentCodes: ['Bool', config.sizeInt],
						code: 'NtString'
				}
		},
		{
				name: 'Texer',
				// Texer...........................
				code:
						// prettier-ignore
						[
								0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						null0: config.sizeInt * 4,
						image: ['SizeString', 260],
						input: ['Bit', 0, 'BlendmodeIn'],
						blendMode: ['Bit', 2, 'BlendmodeTexer'],
						null1: 3, // fill up bitfield
						particles: config.sizeInt,
						null2: 4
				}
		},
		{
				name: 'Texer II',
				// Acko.net: Texer II..............
				code:
						// prettier-ignore
						[
								0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74,
								0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20,
								0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Render',
				func: 'generic',
				fields: {
						null0: config.sizeInt,
						imageSrc: ['SizeString', 260],
						resizing: ['Bool', config.sizeInt],
						wrapAround: ['Bool', config.sizeInt],
						colorFiltering: ['Bool', config.sizeInt],
						null1: config.sizeInt,
						code: 'CodeIFBP'
				}
		},
		{
				name: 'Color Map',
				// Color Map.......................
				code:
						// prettier-ignore
						[
								0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61,
								0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						key: ['ColorMapKey', config.sizeInt],
						blendMode: ['BlendmodeColorMap', config.sizeInt],
						mapCycleMode: ['ColorMapCycleMode', config.sizeInt],
						adjustBlend: 1,
						null0: 1,
						dontSkipFastBeats: ['Bool', 1],
						cycleSpeed: 1, // 1 to 64
						maps: 'ColorMaps'
				}
		},
		{
				name: 'Framerate Limiter',
				// VFX FRAMERATE LIMITER...........
				code:
						// prettier-ignore
						[
								0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D,
								0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49,
								0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						limit: config.sizeInt
				}
		},
		{
				name: 'Convolution Filter',
				// Holden03: Convolution Filter....
				code:
						// prettier-ignore
						[
								0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33,
								0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C,
								0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69,
								0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						edgeMode: ['ConvolutionEdgeMode', config.sizeInt], // note that edgeMode==WRAP and absolute are mutually exclusive.
						absolute: ['Bool', config.sizeInt], // they can however both be false/zero
						twoPass: ['Bool', config.sizeInt],
						kernel: ['ConvoFilter', [7, 7]],
						bias: 'Int32',
						scale: 'Int32'
				}
		},
		{
				name: 'Triangle',
				// Render: Triangle................
				code:
						// prettier-ignore
						[
								0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20,
								0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						code: 'NtCodeIFBP'
				}
		},
		{
				name: 'Channel Shift', // AVS's (Unconed's) channel shift is buggy in that RGB cannot be selected. but you can turn on 'onBeatRandom' and save in a lucky moment.
				// Channel Shift...................
				code:
						// prettier-ignore
						[
								0x43, 0x68, 0x61, 0x6E, 0x6E, 0x65, 0x6C, 0x20,
								0x53, 0x68, 0x69, 0x66, 0x74, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						// some keys seeem to have changed between versions.
						mode: ['Map4', { 0: 'RGB', 1023: 'RGB', 1144: 'RGB', 1020: 'RBG', 1019: 'BRG', 1021: 'BGR', 1018: 'GBR', 1022: 'GRB', 1183: 'RGB' /*1183 (probably from an old APE version?) presents as if nothing is selected, so set to RGB*/ }],
						onBeatRandom: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Normalize',
				// Trans: Normalise................
				code:
						// prettier-ignore
						[
								0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E,
								0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Video Delay',
				// Holden04: Video Delay...........
				code:
						// prettier-ignore
						[
								0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34,
								0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20,
								0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						useBeats: ['Bool', config.sizeInt],
						delay: config.sizeInt
				}
		},
		{
				name: 'Multiplier', // r_multiplier.cpp
				// Multiplier......................
				code:
						// prettier-ignore
						[
								0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69,
								0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						multiply: ['Map4', { 0: 'INFINITE_ROOT', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'INFINITE_SQUARE' }]
				}
		},
		{
				name: 'Color Reduction', // r_colorreduction.cpp
				// Color Reduction.................
				code:
						// prettier-ignore
						[
								0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x52, 0x65,
								0x64, 0x75, 0x63, 0x74, 0x69, 0x6F, 0x6E, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						null0: 260, // MAX_PATH - space for a file path, unused
						colors: ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }]
				}
		},
		{
				name: 'Multi Delay', // r_multidelay.cpp
				// Holden05: Multi Delay...........
				code:
						// prettier-ignore
						[
								0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x35,
								0x3A, 0x20, 0x4D, 0x75, 0x6C, 0x74, 0x69, 0x20,
								0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Trans',
				func: 'generic',
				fields: {
						mode: ['Map4', { 0: 'DISABLED', 1: 'INPUT', 2: 'OUTPUT' }],
						activeBuffer: config.sizeInt,
						useBeats0: ['Bool', config.sizeInt],
						delay0: config.sizeInt,
						useBeats1: ['Bool', config.sizeInt],
						delay1: config.sizeInt,
						useBeats2: ['Bool', config.sizeInt],
						delay2: config.sizeInt,
						useBeats3: ['Bool', config.sizeInt],
						delay3: config.sizeInt,
						useBeats4: ['Bool', config.sizeInt],
						delay4: config.sizeInt,
						useBeats5: ['Bool', config.sizeInt],
						delay5: config.sizeInt
				}
		},
		{
				name: 'Buffer Blend',
				// Misc: Buffer blend..............
				code:
						// prettier-ignore
						[
								0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75,
								0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65,
								0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						bufferB: ['BufferBlendBuffer', config.sizeInt],
						bufferA: ['BufferBlendBuffer', config.sizeInt],
						mode: ['BufferBlendMode', config.sizeInt]
				}
		},
		{
				name: 'MIDI Trace',
				// Nullsoft Pixelcorps: MIDItrace .
				code:
						// prettier-ignore
						[
								0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
								0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F,
								0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44,
								0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						channel: config.sizeInt,
						mode: ['Map4', { 1: 'CURRENT', 2: 'TRIGGER' }],
						allChannels: ['Bool', config.sizeInt],
						printEvents: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Add Borders',
				// Virtual Effect: Addborders......
				code:
						// prettier-ignore
						[
								0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20,
								0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20,
								0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65,
								0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						color: 'Color',
						size: config.sizeInt
				}
		},
		{
				name: 'AVI Player', // Goebish avi player - incomplete! Many many options, supposedly very unstable APE (i.e. no one used this) - until now to lazy to implement
				// VFX AVI PLAYER..................
				code:
						// prettier-ignore
						[
								0x56, 0x46, 0x58, 0x20, 0x41, 0x56, 0x49, 0x20,
								0x50, 0x4C, 0x41, 0x59, 0x45, 0x52, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						filePath: ['SizeString', 256],
						enabled: ['Bool', config.sizeInt]
						// more...
				}
		},
		{
				name: 'FyrewurX',
				// FunkyFX FyrewurX v1.............
				code:
						// prettier-ignore
						[
								0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20,
								0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58,
								0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Global Variables',
				// Jheriko: Global.................
				code:
						// prettier-ignore
						[
								0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x3A,
								0x20, 0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						load: ['Map4', { 0: 'NONE', 1: 'ONCE', 2: 'CODE_CONTROL', 3: 'EVERY_FRAME' }],
						null0: config.sizeInt * 6,
						code: 'NtCodeIFB',
						file: 'NtString',
						saveRegRange: 'NtString',
						saveBufRange: 'NtString'
				}
		},
		{
				name: 'Fluid',
				// GeissFluid......................
				code:
						// prettier-ignore
						[
								0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75,
								0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						null0: config.sizeInt // Fluid saves its parameter globally somewhere, not in the preset file - great... :/
				}
		},
		{
				name: 'Picture II',
				// Picture II......................
				code:
						// prettier-ignore
						[
								0x50, 0x69, 0x63, 0x74, 0x75, 0x72, 0x65, 0x20,
								0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						image: ['NtString', 260],
						blendMode: ['BlendmodePicture2', config.sizeInt],
						onBeatOutput: ['BlendmodePicture2', config.sizeInt],
						bilinear: ['Bool', config.sizeInt],
						onBeatBilinear: ['Bool', config.sizeInt],
						adjustBlend: config.sizeInt, // 0 to 255
						onBeatAdjustBlend: config.sizeInt // 0 to 255
				}
		},
		{
				name: 'MultiFilter',
				// Jheriko : MULTIFILTER...........
				code:
						// prettier-ignore
						[
								0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20,
								0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46,
								0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Misc',
				func: 'generic',
				fields: {
						enabled: ['Bool', config.sizeInt],
						effect: ['MultiFilterEffect', config.sizeInt],
						onBeat: ['Bool', config.sizeInt],
						null0: ['Bool', config.sizeInt]
				}
		},
		{
				name: 'Particle System',
				// ParticleSystem..................
				code:
						// prettier-ignore
						[
								0x50, 0x61, 0x72, 0x74, 0x69, 0x63, 0x6C, 0x65,
								0x53, 0x79, 0x73, 0x74, 0x65, 0x6D, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
								0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
						],
				group: 'Render',
				func: 'generic',
				fields: {
						enabled: ['Bool', 1],
						bigParticles: ['Bool', 1],
						null0: 2,
						particles: config.sizeInt,
						'particles+/-': config.sizeInt,
						lifetime: config.sizeInt,
						'lifetime+/-': config.sizeInt,
						null1: 32,
						spread: 'Float', // 0 to 1
						initialSpeed: 'Float',
						'initialSpeed+/-': 'Float',
						acceleration: 'Float',
						accelerationType: ['ParticleSystemAccelerationType', config.sizeInt],
						color: 'Color',
						'color+/-': 'Color',
						colorChange3: 1,
						colorChange2: 1,
						colorChange1: 1,
						null2: 1,
						'colorChange+/-3': 1,
						'colorChange+/-2': 1,
						'colorChange+/-1': 1,
						null3: 1,
						colorBounce: ['ParticleSystemColorBounce', config.sizeInt]
				}
		}
		/*
		{
				'name': '',
				'code': //
						[],
				'group': '',
				'func': 'generic',
				'fields': {

				}
		},
		*/
];

export { builtin, dll };
