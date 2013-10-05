// sizeInt = 4;

var builtinComponents = [
		//// built-in components
			{"name": "Effect List",
				"code": 0xfffffffe, "group": "", "func": "effectList"},
			{"name": "FadeOut",
				"code": 0x03, "group": "Trans", "func": "generic", "fields": {
					"speed": sizeInt,
					"color": ["Color", sizeInt], 
				}},
			{"name": "Blitter Feedback",
				"code": 0x04, "group": "Misc", "func": "generic", "fields": {
					"zoom": sizeInt, // [position]: [factor] -> 0x00: 2, 0x20: 1, 0xA0: 0.5, 0x100: ~1/3
					"onBeatZoom": sizeInt,
					"output": ["Map4", {0: "Replace", 1: "50/50"}],
					"onBeat": ["Bool", sizeInt],
					"bilinear": ["Bool", sizeInt],
				}},
			{"name": "Blur",
				"code": 0x06, "group": "Trans", "func": "generic", "fields": {
					"blur": ["Map4", {0: "None", 1: "Medium", 2: "Light", 3: "Heavy"}],
					"round": ["Map4", {0: "Down", 1: "Up"}],
				}},
			{"name": "Movement",
				"code": 0x0F, "group": "Trans", "func": "movement"}, // this save format is too complicated for the generic decoder.
			{"name": "Buffer Save",
				"code": 0x12, "group": "Misc", "func": "generic", "fields": {
					"mode": ["BufferMode", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"blend": ["BlendmodeBuffer", sizeInt],
					"adjustBlend": sizeInt,
				}},
			{"name": "Water",
				"code": 0x14, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
				}},
			{"name": "Comment",
				"code": 0x15, "group": "Misc", "func": "generic", "fields": {
					"text": "SizeString"
				}},
			{"name": "Grain",
				"code": 0x18, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"amount": sizeInt, // 0-100
					"static": ["Bool", sizeInt],
				}},
			{"name": "Clear Screen",
				"code": 0x19, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"color": ["Color", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onlyFirst": ["Bool", sizeInt],
				}},
			{"name": "Starfield",
				"code": 0x1B, "group": "Render", "func": "generic", "fields": {
					"enabled": sizeInt,
					"color": "Color",
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"WarpSpeed": ["Float32", sizeInt],
					"MaxStars_set": sizeInt,
					"onbeat": sizeInt,
					"spdBeat": ["Float32", sizeInt],
					"durFrames": sizeInt,
				}},
			{"name": "Bump",
				"code": 0x1D, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"onBeat": ["Bool", sizeInt],
					"duration": sizeInt, // 0-100
					"depth": sizeInt, // 0-100
					"onBeatDepth": sizeInt, // 0-100
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"code": "CodeFBI",
					"showDot": ["Bool", sizeInt],
					"invertDepth": ["Bool", sizeInt],
					null0: sizeInt,
					"depthBuffer": ["BufferNum", sizeInt]
				}},
			{"name": "Mosaic",
				"code": 0x1E, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"size": sizeInt,
					"sizeOnBeat": sizeInt,
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onbeat": ["Bool", sizeInt],
					"durFrames": sizeInt,
				}},
			{"name": "Water Bump",
				"code": 0x1F, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"density": sizeInt,
					"depth": sizeInt,
					"random": ["Bool", sizeInt],
					"dropPositionX": sizeInt,
					"dropPositionY": sizeInt,
					"dropRadius": sizeInt,
					"method": sizeInt,
				}},
			{"name": "Invert",
				"code": 0x25, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
				}},
			{"name": "Super Scope",
				"code": 0x24, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", 1], // no UI for this in AVS -> always says: 0x01, setting this to zero manually will disable the SSC.
					"code": "CodePFBI",
					"audioChannel": ["Bit", [0,1], "AudioChannel"],
					"audioRepresent": ["Bit", 2, "AudioRepresent"],
					null0: 3, // padding, bitfield before is actually 32 bit
					"colors": "ColorList",
					"lineType": ["DrawMode", sizeInt],
				}},
			{"name": "Set Render Mode",
				"code": 0x28, "group": "Misc", "func": "generic", "fields": {
					'blend': ["BlendmodeRender", 1],
					'adjustBlend': 1,
					'lineSize': 1,
					'enabled': ["Bit", 7, "Boolified"],
				}},
			{"name": "Dynamic Movement",
				"code": 0x2B, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", 1], // same as in SSC, no UI
					"code": "CodePFBI",
					"bilinear": ["Bool", sizeInt],
					"coordinates": ["Coordinates", sizeInt],
					"gridW": sizeInt,
					"gridH": sizeInt,
					"alpha": ["Bool", sizeInt],
					"wrap": ["Bool", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"alphaOnly": ["Bool", sizeInt],
			}},
			{"name": "Fast Brightness",
				"code": 0x2C, "group": "Trans", "func": "generic", "fields": {
					"factor": ["Map4", {0: 2, 1: 0.5, 2: 1}],
				}},
			{"name": "Color Modifier",
				"code": 0x2D, "group": "Trans", "func": "generic", "fields": {
					"recomputeEveryFrame": ["Bool", 1],
					"code": "CodePFBI",
				}},
		///////////////////////////
		//// check these in hex:
			// {"name": "Text",
			// 	"code": 0x1C, "group": "Render", "func": "generic", "fields": {
			// 		"enabled": ["Bool", sizeInt],
			// 		"color": ["Color", sizeInt],
			// 		"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
			// 		"onbeat": ["Bool", sizeInt],
			// 		"insertBlank": ["Bool", sizeInt],
			// 		"randomPos": ["Bool", sizeInt],
			// 		"valign": sizeInt,
			// 		"halign": sizeInt,
			// 		"onbeatSpeed": sizeInt,
			// 		"normSpeed": sizeInt,
			// 		"chooseFont": ["SizeString", 256], // no idea, RESEARCH!
			// 		"logFont": ["SizeString", 256],
			// 		"string": "SizeString",
			// 		"outline": ["Bool", sizeInt],
			// 		"outlinecolor": sizeInt,
			// 		"xshift": sizeInt,
			// 		"yshift": sizeInt,
			// 		"outlinesize": sizeInt,
			// 		"randomword": ["Bool", sizeInt],
			// 		"shadow": ["Bool", sizeInt],
			// 	}},
		];
