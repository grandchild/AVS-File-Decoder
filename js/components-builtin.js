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
			{"name": "Buffer Save",
				"code": 0x12, "group": "Misc", "func": "generic", "fields": {
					"mode": ["BufferMode", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"blend": ["BlendmodeBuffer", sizeInt],
					"adjustBlend": sizeInt,
				}},
			{"name": "Comment",
				"code": 0x15, "group": "Misc", "func": "generic", "fields": {
					"text": "SizeString"
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
			{"name": "Color Modifier",
				"code": 0x2D, "group": "Trans", "func": "generic", "fields": {
					"recomputeEveryFrame": ["Bool", 1],
					"code": "CodePFBI",
				}},
		];
