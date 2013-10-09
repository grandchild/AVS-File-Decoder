// sizeInt = 4;

var builtinComponents = [
			{"name": "Effect List", // builtin and r_list.cpp for extended Effect Lists
				"code": 0xfffffffe, "group": "", "func": "effectList"},
			{"name": "Simple", // r_simple.cpp
				"code": 0x00, "group": "Render", "func": "simple"}, // ironically, this save format is too complicated for the generic decoder.
			{"name": "Dot Plane", // r_dotpln.cpp
				"code": 0x01, "group": "Render", "func": "generic", "fields": {
					"rotationSpeed": "Int32", // -50 to 50
					"colorTop": "Color",
					"colorHigh": "Color",
					"colorMid": "Color",
					"colorLow": "Color",
					"colorBottom": "Color",
					"angle": "Int32",
					null0: sizeInt, // [see comment on dot fountan]
				}},
			{"name": "Oscilliscope Star", // r_oscstar.cpp
				"code": 0x02, "group": "Render", "func": "generic", "fields": {
					"audioChannel": ["Bit", [2,3], "AudioChannel"],
					"positionX": ["Bit", [4,5], "PositionX"],
					null0: sizeInt-1,
					"colors": "ColorList",
					"size": sizeInt,
					"rotation": sizeInt,
				}},
			{"name": "FadeOut", // r_fadeout.cpp
				"code": 0x03, "group": "Trans", "func": "generic", "fields": {
					"speed": sizeInt,
					"color": ["Color", sizeInt], 
				}},
			{"name": "Blitter Feedback", // r_blit.cpp
				"code": 0x04, "group": "Misc", "func": "generic", "fields": {
					"zoom": sizeInt, // [position]: [factor] -> 0x00: 2, 0x20: 1, 0xA0: 0.5, 0x100: ~1/3
					"onBeatZoom": sizeInt,
					"output": ["Map4", {0: "Replace", 1: "50/50"}],
					"onBeat": ["Bool", sizeInt],
					"bilinear": ["Bool", sizeInt],
				}},
			{"name": "OnBeat Clear", // r_nfclr.cpp
				"code": 0x05, "group": "Render", "func": "generic", "fields": {
					"color": "Color",
					"output": ["Map4", {0: "Replace", 1: "50/50"}],
					"clearBeats": sizeInt,
				}},
			{"name": "Blur", // r_blur.cpp
				"code": 0x06, "group": "Trans", "func": "generic", "fields": {
					"blur": ["Map4", {0: "None", 1: "Medium", 2: "Light", 3: "Heavy"}],
					"round": ["Map4", {0: "Down", 1: "Up"}],
				}},
			{"name": "Bass Spin", // r_bspin.cpp
				"code": 0x07, "group": "Trans", "func": "generic", "fields": {
					"enabledLeft": ["Bit", 0, "Boolified"],
					"enabledRight": ["Bit", 1, "Boolified"],
					null0: sizeInt-1, // fill up bitfield
					"colorLeft": "Color",
					"colorRight": "Color",
					"mode": ["Map4", {0: "Lines", 1: "Triangles"}],
				}},
			{"name": "Moving Particle", // r_parts.cpp
				"code": 0x08, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bit", 0, "Boolified"],
					"onBeatSizeChange": ["Bit", 1, "Boolified"],
					null0: sizeInt-1, // fill up bitfield
					"color": "Color",
					"range": sizeInt, // 1-20: min(h/2,w*(3/8))*range/32.0
					"size": sizeInt,
					"onBeatSize": sizeInt,
					"output": ["Map4", {0: "Replace", 1: "Additive", 2: "50/50", 3: "Default"}],
				}},
			//// 0x09 ?
			{"name": "SVP", // r_svp.cpp
				"code": 0x0A, "group": "Render", "func": "generic", "fields": {
					"library": ["SizeString", 260],
				}},
			{"name": "Colorfade", // r_colorfade.cpp
				"code": 0x0B, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bit", 0, "Boolified"],
					"onBeat": ["Bit", 2, "Boolified"], // i changed the order a bit here
					"onBeatRandom": ["Bit", 1, "Boolified"],
					null0: sizeInt-1, // fill up bitfield
					"fader1": "Int32", // all faders go from -32 to 32
					"fader2": "Int32",
					"fader3": "Int32",
					"beatFader1": "Int32",
					"beatFader2": "Int32",
					"beatFader3": "Int32",
				}},
			{"name": "Color Clip", // r_contrast.cpp
				"code": 0x0C, "group": "Trans", "func": "generic", "fields": {
					"mode": ["Map4", {0: "Off", 1: "Below", 2: "Above", 3: "Near"}],
					"colorFrom": "Color",
					"colorTo": "Color",
					"colorDistance": sizeInt,
				}},
			{"name": "Rotating Stars", // r_rotstar.cpp
				"code": 0x0D, "group": "Render", "func": "generic", "fields": {
					"colors": "ColorList",
				}},
			{"name": "Ring", // r_oscring.cpp
				"code": 0x0E, "group": "Render", "func": "generic", "fields": {
					"audioChannel": ["Bit", [2,3], "AudioChannel"],
					"positionX": ["Bit", [4,5], "PositionX"],
					null0: sizeInt-1,
					"colors": "ColorList",
					"size": sizeInt,
					"audioSource": ["UInt32", sizeInt, "AudioSource"],
				}},
			{"name": "Movement", // r_trans.cpp
				"code": 0x0F, "group": "Trans", "func": "movement"},
			{"name": "Scatter", // r_scat.cpp
				"code": 0x10, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
				}},
			{"name": "Dot Grid", // r_dotgrid.cpp
				"code": 0x11, "group": "Render", "func": "generic", "fields": {
					"colors": "ColorList",
					"spacing": sizeInt,
					"speedX": "Int32", // -512 to 544
					"speedY": "Int32",
					"output": ["Map4", {0: "Replace", 1: "Additive", 2: "50/50", 3: "Default"}],
				}},
			{"name": "Buffer Save", // r_stack.cpp
				"code": 0x12, "group": "Misc", "func": "generic", "fields": {
					"mode": ["BufferMode", sizeInt],
					"buffer": ["BufferNum", sizeInt],
					"blend": ["BlendmodeBuffer", sizeInt],
					"adjustBlend": sizeInt,
				}},
			{"name": "Dot Fountain", // r_dotfnt.cpp
				"code": 0x13, "group": "Render", "func": "generic", "fields": {
					"rotationSpeed": "Int32", // -50 to 50
					"colorTop": "Color",
					"colorHigh": "Color",
					"colorMid": "Color",
					"colorLow": "Color",
					"colorBottom": "Color",
					"angle": "Int32",
					null0: sizeInt, // most likely current rotation, has some huge value, has no ui, is basically arbitrary depending on time of save, not converted
				}},
			{"name": "Water", // r_water.cpp
				"code": 0x14, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
				}},
			{"name": "Comment", // r_comment.cpp
				"code": 0x15, "group": "Misc", "func": "generic", "fields": {
					"text": "SizeString"
				}},
			{"name": "Brightness", // r_bright.cpp
				"code": 0x16, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"red": "Int32",   // \
					"green": "Int32", //  > -4096 to 4096
					"blue": "Int32",  // /
					"separate": ["Bool", sizeInt],
					"excludeColor": "Color",
					"exclude": ["Bool", sizeInt],
					"distance": sizeInt, // 0 to 255
				}},
			{"name": "Interleave", // r_interleave.cpp
				"code": 0x17, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"x": sizeInt,
					"y": sizeInt,
					"color": "Color",
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onbeat": ["Bool", sizeInt],
					"x2": sizeInt,
					"y2": sizeInt,
					"beatDuration": sizeInt,
				}},
			{"name": "Grain", // r_grain.cpp
				"code": 0x18, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"amount": sizeInt, // 0-100
					"static": ["Bool", sizeInt],
				}},
			{"name": "Clear Screen", // r_clear.cpp
				"code": 0x19, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"color": ["Color", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onlyFirst": ["Bool", sizeInt],
				}},
			{"name": "Mirror", // r_mirror.cpp
				"code": 0x1A, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"topToBottom": ["Bit", 0, "Boolified"],
					"bottomToTop": ["Bit", 1, "Boolified"],
					"leftToRight": ["Bit", 2, "Boolified"],
					"rightToLeft": ["Bit", 3, "Boolified"],
					null0: sizeInt-1, // fill up bitfield space
					"onBeat": ["Bool", sizeInt],
					"smooth": ["Bool", sizeInt],
					"speed": sizeInt,
				}},
			{"name": "Starfield", // r_stars.cpp
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
			{"name": "Text", // r_text.cpp
				"code": 0x1C, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"color": ["Color", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onBeat": ["Bool", sizeInt],
					"insertBlanks": ["Bool", sizeInt],
					"randomPosition": ["Bool", sizeInt],
					"verticalAlign": ["Map4", {"0": "Top", "4": "Center", "8": "Bottom",}],
					"horizontalAlign": ["Map4", {"0": "Left", "1": "Center", "2": "Right",}],
					"onBeatSpeed": sizeInt,
					"normSpeed": sizeInt,
					null0: 60, // Win CHOOSEFONT structure, little relevance afaics
					// Win LOGFONT structure, 60bytes, this is more interesting:
						null1: sizeInt*4, // LONG  lfHeight;
											// LONG  lfWidth;
											// LONG  lfEscapement;
											// LONG  lfOrientation;
						// LONG  lfWeight;
							"weight": ["Map4", {"0": "Dontcare", "100": "Thin", "200": "Extralight", "200": "Ultralight", "300": "Light", "400": "Normal", "400": "Regular", "500": "Medium", "600": "Semibold", "600": "Demibold", "700": "Bold", "800": "Extrabold", "800": "Ultrabold", "900": "Heavy", "900": "Black"}],
						"italic": ["Bool", 1], // BYTE  lfItalic;
						"underline": ["Bool", 1], // BYTE  lfUnderline;
						"strikeOut": ["Bool", 1], // BYTE  lfStrikeOut;
						"charSet": 1, //too lazy, FIXME: "charSet": ["Map4", {"0": "Western", /*...*/}], // BYTE  lfCharSet;
						null2: 4, // BYTE  lfOutPrecision;
											// BYTE  lfClipPrecision;
											// BYTE  lfQuality;
											// BYTE  lfPitchAndFamily;
						"fontName": ["SizeString", 32], // TCHAR lfFaceName[LF_FACESIZE];
					"text": ["SizeString", 0/*==var length*/, "SemiColSplit"],
					"outline": ["Bool", sizeInt],
					"outlineColor": "Color",
					"shiftX": sizeInt,
					"shiftY": sizeInt,
					"outlineShadowSize": sizeInt,
					"randomWord": ["Bool", sizeInt],
					"shadow": ["Bool", sizeInt],
				}},
			{"name": "Bump", // r_bump.cpp
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
			{"name": "Mosaic", // r_mosaic.cpp
				"code": 0x1E, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"size": sizeInt,
					"sizeOnBeat": sizeInt,
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onbeat": ["Bool", sizeInt],
					"durFrames": sizeInt,
				}},
			{"name": "Water Bump", // r_waterbump.cpp
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
			{"name": "AVI", // r_avi.cpp
				"code": 0x20, "group": "Trans", "func": "avi"},
			{"name": "Custom BPM", // r_bpm.cpp
				"code": 0x21, "group": "Misc", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"mode": ["RadioButton", {0: "Arbitrary", 1: "Skip", 2: "Reverse"}],
					"arbitraryValue": sizeInt,
					"skipValue": sizeInt,
					"skipFirstBeats": sizeInt, // setting this to n>0 also prevents arbitrary mode from running on load of preset until n beats have passed.
				}},
			{"name": "Picture", // r_picture.cpp
				"code": 0x22, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"adapt": sizeInt,
					"onBeatPersist": sizeInt, // 0 to 32
					"file": "NtString",
					"ratio": sizeInt,
					"aspectRatioAxis": ["Map4", {0: "X", 1: "Y"}],
				}},
			{"name": "Dynamic Distance Modifier", // r_ddm.cpp
				"code": 0x23, "group": "Trans", "func": "generic", "fields": {
					null0: 1,
					"code": "CodePFBI",
					"output": ["Map4", {0: "Replace", 1: "50/50"}],
					"bilinear": ["Bool", sizeInt],
				}},
			{"name": "Super Scope", // r_ssc.cpp
				"code": 0x24, "group": "Render", "func": "generic", "fields": {
					"version": ["Bool", 1], // 0: v0.1, 1: v0.2
					"code": "CodePFBI",
					"audioChannel": ["Bit", [0,1], "AudioChannel"],
					"audioSource": ["Bit", 2, "AudioSource"],
					null0: 3, // padding, bitfield before is actually 32 bit
					"colors": "ColorList",
					"lineType": ["DrawMode", sizeInt],
				}},
			{"name": "Invert", // r_invert.cpp
				"code": 0x25, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
				}},
			{"name": "Unique Tone", // r_onetone.cpp
				"code": 0x26, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"color": "Color",
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"invert": ["Bool", sizeInt],
				}},
			{"name": "Timescope", // r_timescope.cpp
				"code": 0x27, "group": "Render", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"color": "Color",
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50", 2: "Default"}],
					"audioChannel": ["UInt32", sizeInt, "AudioChannel"],
					"bands": sizeInt,
				}},
			{"name": "Set Render Mode", // r_linemode.cpp
				"code": 0x28, "group": "Misc", "func": "generic", "fields": {
					'blend': ["BlendmodeRender", 1],
					'adjustBlend': 1,
					'lineSize': 1,
					'enabled': ["Bit", 7, "Boolified"],
				}},
			{"name": "Interference", // r_interf.cpp
				"code": 0x29, "group": "Trans", "func": "generic", "fields": {
					"enabled": ["Bool", sizeInt],
					"numberOfLayers": sizeInt,
					null0: sizeInt, // current rotation, is virtually arbitrary - not converted
					"distance": sizeInt, // 1 to 64
					"alpha": sizeInt, // 1 to 255
					"rotation": "Int32", // 32 to -32 (ui has inverted range)
					"output": ["Map8", {0: "Replace", 1: "Additive", 0x100000000: "50/50"}],
					"onBeatDistance": sizeInt,
					"onBeatAlpha": sizeInt,
					"onBeatRotation": sizeInt,
					"separateRGB": ["Bool", sizeInt],
					"onBeat": ["Bool", sizeInt],
					"speed": "Float32", // 0.01 to 1.28
				}},
			{"name": "Dynamic Shift", // r_sPhift.cpp
				"code": 0x2A, "group": "Trans", "func": "generic", "fields": {
					"version": ["Bool", 1], // 0: v0.1, v1: 0.2
					"code": "CodeIFB",
					"output": ["Map4", {0: "Replace", 1: "50/50"}],
					"bilinear": ["Bool", sizeInt],
				}},
			{"name": "Dynamic Movement", // r_dmove.cpp
				"code": 0x2B, "group": "Trans", "func": "generic", "fields": {
					"version": ["Bool", 1], // 0: v0.1, v1: 0.2
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
			{"name": "Fast Brightness", // r_fastbright.cpp
				"code": 0x2C, "group": "Trans", "func": "generic", "fields": {
					"factor": ["Map4", {0: 2, 1: 0.5, 2: 1}],
				}},
			{"name": "Color Modifier", // r_dcolormod.cpp
				"code": 0x2D, "group": "Trans", "func": "generic", "fields": {
					"recomputeEveryFrame": ["Bool", 1],
					"code": "CodePFBI",
				}},
		];
