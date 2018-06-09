"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Constants
var sizeInt = 4;
var builtin = [
    {
        'name': 'Effect List',
        'code': 0xfffffffe,
        'group': '',
        'func': 'effectList'
    },
    {
        'name': 'Simple',
        'code': 0x00,
        'group': 'Render',
        'func': 'simple'
    },
    {
        'name': 'Dot Plane',
        'code': 0x01,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'rotationSpeed': 'Int32',
            'colorTop': 'Color',
            'colorHigh': 'Color',
            'colorMid': 'Color',
            'colorLow': 'Color',
            'colorBottom': 'Color',
            'angle': 'Int32',
            null0: sizeInt,
        }
    },
    {
        'name': 'Oscilliscope Star',
        'code': 0x02,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
            'positionX': ['Bit', [4, 5], 'PositionX'],
            null0: sizeInt - 1,
            'colors': 'ColorList',
            'size': sizeInt,
            'rotation': sizeInt,
        }
    },
    {
        'name': 'FadeOut',
        'code': 0x03,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'speed': sizeInt,
            'color': 'Color',
        }
    },
    {
        'name': 'Blitter Feedback',
        'code': 0x04,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'zoom': sizeInt,
            'onBeatZoom': sizeInt,
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', sizeInt],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'OnBeat Clear',
        'code': 0x05,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'color': 'Color',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'clearBeats': sizeInt,
        }
    },
    {
        'name': 'Blur',
        'code': 0x06,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'blur': ['Map4', { 0: 'NONE', 1: 'MEDIUM', 2: 'LIGHT', 3: 'HEAVY' }],
            'round': ['Map4', { 0: 'DOWN', 1: 'UP' }],
        }
    },
    {
        'name': 'Bass Spin',
        'code': 0x07,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabledLeft': ['Bit', 0, 'Boolified'],
            'enabledRight': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1,
            'colorLeft': 'Color',
            'colorRight': 'Color',
            'mode': ['Map4', { 0: 'LINES', 1: 'TRIANGLES' }],
        }
    },
    {
        'name': 'Moving Particle',
        'code': 0x08,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bit', 0, 'Boolified'],
            'onBeatSizeChange': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1,
            'color': 'Color',
            'distance': sizeInt,
            'particleSize': sizeInt,
            'onBeatParticleSize': sizeInt,
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }],
        }
    },
    {
        'name': 'Roto Blitter',
        'code': 0x09,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'zoom': sizeInt,
            'rotate': sizeInt,
            'blendMode': ['Map4', { '0': 'REPLACE', '1': 'FIFTY_FIFTY' }],
            'onBeatReverse': ['Bool', sizeInt],
            'reversalSpeed': sizeInt,
            'onBeatZoom': sizeInt,
            'onBeat': ['Bool', sizeInt],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'SVP',
        'code': 0x0A,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'library': ['SizeString', 260],
        }
    },
    {
        'name': 'Colorfade',
        'code': 0x0B,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bit', 0, 'Boolified'],
            'onBeat': ['Bit', 2, 'Boolified'],
            'onBeatRandom': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1,
            'fader1': 'Int32',
            'fader2': 'Int32',
            'fader3': 'Int32',
            'beatFader1': 'Int32',
            'beatFader2': 'Int32',
            'beatFader3': 'Int32',
        }
    },
    {
        'name': 'Color Clip',
        'code': 0x0C,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'mode': ['Map4', { 0: 'OFF', 1: 'BELOW', 2: 'ABOVE', 3: 'NEAR' }],
            'color': 'Color',
            'outColor': 'Color',
            'level': sizeInt,
        }
    },
    {
        'name': 'Rotating Stars',
        'code': 0x0D,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList',
        }
    },
    {
        'name': 'Ring',
        'code': 0x0E,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
            'positionX': ['Bit', [4, 5], 'PositionX'],
            null0: sizeInt - 1,
            'colors': 'ColorList',
            'size': sizeInt,
            'audioSource': ['UInt32', sizeInt, 'AudioSource'],
        }
    },
    {
        'name': 'Movement',
        'code': 0x0F,
        'group': 'Trans',
        'func': 'movement'
    },
    {
        'name': 'Scatter',
        'code': 0x10,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Dot Grid',
        'code': 0x11,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList',
            'spacing': sizeInt,
            'speedX': 'Int32',
            'speedY': 'Int32',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }],
        }
    },
    {
        'name': 'Buffer Save',
        'code': 0x12,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'action': ['BufferMode', sizeInt],
            'bufferId': ['BufferNum', sizeInt],
            'blendMode': ['BlendmodeBuffer', sizeInt],
            'adjustBlend': sizeInt,
        }
    },
    {
        'name': 'Dot Fountain',
        'code': 0x13,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'rotationSpeed': 'Int32',
            'colorTop': 'Color',
            'colorHigh': 'Color',
            'colorMid': 'Color',
            'colorLow': 'Color',
            'colorBottom': 'Color',
            'angle': 'Int32',
            null0: sizeInt,
        }
    },
    {
        'name': 'Water',
        'code': 0x14,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Comment',
        'code': 0x15,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'text': 'SizeString'
        }
    },
    {
        'name': 'Brightness',
        'code': 0x16,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'red': 'Int32',
            'green': 'Int32',
            'blue': 'Int32',
            'separate': ['Bool', sizeInt],
            'excludeColor': 'Color',
            'exclude': ['Bool', sizeInt],
            'distance': sizeInt,
        }
    },
    {
        'name': 'Interleave',
        'code': 0x17,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'x': sizeInt,
            'y': sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onbeat': ['Bool', sizeInt],
            'x2': sizeInt,
            'y2': sizeInt,
            'beatDuration': sizeInt,
        }
    },
    {
        'name': 'Grain',
        'code': 0x18,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'amount': sizeInt,
            'static': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Clear Screen',
        'code': 0x19,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'onlyFirst': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Mirror',
        'code': 0x1A,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'topToBottom': ['Bit', 0, 'Boolified'],
            'bottomToTop': ['Bit', 1, 'Boolified'],
            'leftToRight': ['Bit', 2, 'Boolified'],
            'rightToLeft': ['Bit', 3, 'Boolified'],
            null0: sizeInt - 1,
            'onBeatRandom': ['Bool', sizeInt],
            'smoothTransition': ['Bool', sizeInt],
            'transitionDuration': sizeInt,
        }
    },
    {
        'name': 'Starfield',
        'code': 0x1B,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'WarpSpeed': 'Float',
            'MaxStars_set': sizeInt,
            'onbeat': sizeInt,
            'spdBeat': 'Float',
            'durFrames': sizeInt,
        }
    },
    {
        'name': 'Text',
        'code': 0x1C,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', sizeInt],
            'insertBlanks': ['Bool', sizeInt],
            'randomPosition': ['Bool', sizeInt],
            'verticalAlign': ['Map4', { '0': 'TOP', '4': 'CENTER', '8': 'BOTTOM', }],
            'horizontalAlign': ['Map4', { '0': 'LEFT', '1': 'CENTER', '2': 'RIGHT', }],
            'onBeatSpeed': sizeInt,
            'normSpeed': sizeInt,
            null0: 60,
            // Win LOGFONT structure, 60bytes, this is more interesting:
            null1: sizeInt * 4,
            // LONG  lfWidth;
            // LONG  lfEscapement;
            // LONG  lfOrientation;
            // LONG  lfWeight;
            'weight': ['Map4', { '0': 'DONTCARE', '100': 'THIN', '200': 'EXTRALIGHT', '300': 'LIGHT', '400': 'REGULAR', '500': 'MEDIUM', '600': 'SEMIBOLD', '700': 'BOLD', '800': 'EXTRABOLD', '900': 'BLACK' }],
            'italic': ['Bool', 1],
            'underline': ['Bool', 1],
            'strikeOut': ['Bool', 1],
            'charSet': 1,
            null2: 4,
            // BYTE  lfClipPrecision;
            // BYTE  lfQuality;
            // BYTE  lfPitchAndFamily;
            'fontName': ['SizeString', 32],
            'text': ['SizeString', 0 /*==var length*/, 'SemiColSplit'],
            'outline': ['Bool', sizeInt],
            'outlineColor': 'Color',
            'shiftX': sizeInt,
            'shiftY': sizeInt,
            'outlineShadowSize': sizeInt,
            'randomWord': ['Bool', sizeInt],
            'shadow': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Bump',
        'code': 0x1D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'onBeat': ['Bool', sizeInt],
            'duration': sizeInt,
            'depth': sizeInt,
            'onBeatDepth': sizeInt,
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'code': 'CodeFBI',
            'showDot': ['Bool', sizeInt],
            'invertDepth': ['Bool', sizeInt],
            null0: sizeInt,
            'depthBuffer': ['BufferNum', sizeInt]
        }
    },
    {
        'name': 'Mosaic',
        'code': 0x1E,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'squareSize': sizeInt,
            'onBeatSquareSize': sizeInt,
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatSizeChange': ['Bool', sizeInt],
            'onBeatSizeDuration': sizeInt,
        }
    },
    {
        'name': 'Water Bump',
        'code': 0x1F,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'density': sizeInt,
            'depth': sizeInt,
            'random': ['Bool', sizeInt],
            'dropPositionX': sizeInt,
            'dropPositionY': sizeInt,
            'dropRadius': sizeInt,
            'method': sizeInt,
        }
    },
    {
        'name': 'AVI',
        'code': 0x20,
        'group': 'Trans',
        'func': 'avi'
    },
    {
        'name': 'Custom BPM',
        'code': 0x21,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'mode': ['RadioButton', { 0: 'ARBITRARY', 1: 'SKIP', 2: 'REVERSE' }],
            'arbitraryValue': sizeInt,
            'skipValue': sizeInt,
            'skipFirstBeats': sizeInt,
        }
    },
    {
        'name': 'Picture',
        'code': 0x22,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'adapt': sizeInt,
            'onBeatPersist': sizeInt,
            'file': 'NtString',
            'ratio': sizeInt,
            'aspectRatioAxis': ['Map4', { 0: 'X', 1: 'Y' }],
        }
    },
    {
        'name': 'Dynamic Distance Modifier',
        'code': 0x23,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Super Scope',
        'code': 0x24,
        'group': 'Render',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'audioChannel': ['Bit', [0, 1], 'AudioChannel'],
            'audioSource': ['Bit', 2, 'AudioSource'],
            null0: 3,
            'colors': 'ColorList',
            'drawMode': ['DrawMode', sizeInt],
        }
    },
    {
        'name': 'Invert',
        'code': 0x25,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Unique Tone',
        'code': 0x26,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'invert': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Timescope',
        'code': 0x27,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'audioChannel': ['UInt32', sizeInt, 'AudioChannel'],
            'bands': sizeInt,
        }
    },
    {
        'name': 'Set Render Mode',
        'code': 0x28,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'blend': ['BlendmodeRender', 1],
            'adjustBlend': 1,
            'lineSize': 1,
            'enabled': ['Bit', 7, 'Boolified'],
        }
    },
    {
        'name': 'Interferences',
        'code': 0x29,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'numberOfLayers': sizeInt,
            null0: sizeInt,
            'distance': sizeInt,
            'alpha': sizeInt,
            'rotation': 'Int32',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatDistance': sizeInt,
            'onBeatAlpha': sizeInt,
            'onBeatRotation': sizeInt,
            'separateRGB': ['Bool', sizeInt],
            'onBeat': ['Bool', sizeInt],
            'speed': 'Float',
        }
    },
    {
        'name': 'Dynamic Shift',
        'code': 0x2A,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodeIFB',
            'blendMode': ['Map4', { 0: 'Replace', 1: 'FIFTY_FIFTY' }],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Dynamic Movement',
        'code': 0x2B,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'bFilter': ['Bool', sizeInt],
            'coord': ['Coordinates', sizeInt],
            'gridW': sizeInt,
            'gridH': sizeInt,
            'blend': ['Bool', sizeInt],
            'wrap': ['Bool', sizeInt],
            'buffer': ['BufferNum', sizeInt],
            'alphaOnly': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Fast Brightness',
        'code': 0x2C,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'factor': ['Map4', { 0: 2, 1: 0.5, 2: 1 }],
        }
    },
    {
        'name': 'Color Modifier',
        'code': 0x2D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'recomputeEveryFrame': ['Bool', 1],
            'code': 'CodePFBI',
        }
    },
];
exports.builtin = builtin;
//// APEs
var dll = [
    {
        'name': 'AVS Trans Automation',
        'code': // Misc: AVSTrans Automation.......
        [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'logging': ['Bool', sizeInt],
            'translateFirstLevel': ['Bool', sizeInt],
            'readCommentCodes': ['Bool', sizeInt],
            'code': 'NtString',
        }
    },
    {
        'name': 'Texer',
        'code': // Texer...........................
        [0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: sizeInt * 4,
            'image': ['SizeString', 260],
            'input': ['Bit', 0, 'BlendmodeIn'],
            'blendMode': ['Bit', 2, 'BlendmodeTexer'],
            null1: 3,
            'particles': sizeInt,
            null2: 4
        }
    },
    {
        'name': 'Texer II',
        'code': // Acko.net: Texer II..............
        [0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': {
            null0: sizeInt,
            'imageSrc': ['SizeString', 260],
            'resizing': ['Bool', sizeInt],
            'wrapAround': ['Bool', sizeInt],
            'colorFiltering': ['Bool', sizeInt],
            null1: sizeInt,
            'code': 'CodeIFBP',
        }
    },
    {
        'name': 'Color Map',
        'code': // Color Map.......................
        [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'key': ['ColorMapKey', sizeInt],
            'blendMode': ['BlendmodeColorMap', sizeInt],
            'mapCycleMode': ['ColorMapCycleMode', sizeInt],
            'adjustBlend': 1,
            null0: 1,
            'dontSkipFastBeats': ['Bool', 1],
            'cycleSpeed': 1,
            'maps': 'ColorMaps',
        }
    },
    {
        'name': 'Framerate Limiter',
        'code': // VFX FRAMERATE LIMITER...........
        [0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'limit': sizeInt
        }
    },
    {
        'name': 'Convolution Filter',
        'code': // Holden03: Convolution Filter....
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'edgeMode': ['UInt32', sizeInt, 'convolutionEdgeMode'],
            'absolute': ['Bool', sizeInt],
            'twoPass': ['Bool', sizeInt],
            'kernel': ['ConvoFilter', [7, 7]],
            'bias': 'Int32',
            'scale': 'Int32',
        }
    },
    {
        'name': 'Triangle',
        'code': // Render: Triangle................
        [0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20, 0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'code': 'NtCodeIFBP',
        }
    },
    {
        'name': 'Channel Shift',
        'code': // Channel Shift...................
        [0x43, 0x68, 0x61, 0x6E, 0x6E, 0x65, 0x6C, 0x20, 0x53, 0x68, 0x69, 0x66, 0x74, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            // some keys seeem to have changed between versions.
            'mode': ['Map4', { 0: 'RGB', 1023: 'RGB', 1144: 'RGB', 1020: 'RBG', 1019: 'BRG', 1021: 'BGR', 1018: 'GBR', 1022: 'GRB', 1183: 'RGB' /*1183 (probably from an old APE version?) presents as if nothing is selected, so set to RGB*/ }],
            'onBeatRandom': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Normalize',
        'code': // Trans: Normalise................
        [0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E, 0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Video Delay',
        'code': // Holden04: Video Delay...........
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34, 0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'useBeats': ['Bool', sizeInt],
            'delay': sizeInt,
        }
    },
    {
        'name': 'Multiplier',
        'code': // Multiplier......................
        [0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'multiply': ['Map4', { 0: 'INFINITE_ROOT', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'INFINITE_SQUARE' }],
        }
    },
    {
        'name': 'Color Reduction',
        'code': // Color Reduction.................
        [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x52, 0x65, 0x64, 0x75, 0x63, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            null0: 260,
            'colors': ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }],
        }
    },
    {
        'name': 'Multi Delay',
        'code': // Holden05: Multi Delay...........
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x35, 0x3A, 0x20, 0x4D, 0x75, 0x6C, 0x74, 0x69, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'mode': ['Map4', { 0: 'DISABLED', 1: 'INPUT', 2: 'OUTPUT' }],
            'activeBuffer': sizeInt,
            'useBeats0': ['Bool', sizeInt],
            'delay0': sizeInt,
            'useBeats1': ['Bool', sizeInt],
            'delay1': sizeInt,
            'useBeats2': ['Bool', sizeInt],
            'delay2': sizeInt,
            'useBeats3': ['Bool', sizeInt],
            'delay3': sizeInt,
            'useBeats4': ['Bool', sizeInt],
            'delay4': sizeInt,
            'useBeats5': ['Bool', sizeInt],
            'delay5': sizeInt,
        }
    },
    {
        'name': 'Buffer Blend',
        'code': // Misc: Buffer blend..............
        [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65, 0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'bufferB': ['BufferBlendBuffer', sizeInt],
            'bufferA': ['BufferBlendBuffer', sizeInt],
            'mode': ['BufferBlendMode', sizeInt],
        }
    },
    {
        'name': 'MIDI Trace',
        'code': // Nullsoft Pixelcorps: MIDItrace .
        [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F, 0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44, 0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'channel': sizeInt,
            'mode': ['Map4', { 1: 'CURRENT', 2: 'TRIGGER' }],
            'allChannels': ['Bool', sizeInt],
            'printEvents': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Add Borders',
        'code': // Virtual Effect: Addborders......
        [0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20, 0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65, 0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'size': sizeInt,
        }
    },
    {
        'name': 'AVI Player',
        'code': // VFX AVI PLAYER..................
        [0x56, 0x46, 0x58, 0x20, 0x41, 0x56, 0x49, 0x20, 0x50, 0x4C, 0x41, 0x59, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'filePath': ['SizeString', 256],
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'FyrewurX',
        'code': // FunkyFX FyrewurX v1.............
        [0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20, 0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58, 0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Global Variables',
        'code': // Jheriko: Global.................
        [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x3A, 0x20, 0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'load': ['Map4', { 0: 'NONE', 1: 'ONCE', 2: 'CODE_CONTROL', 3: 'EVERY_FRAME' }],
            null0: sizeInt * 6,
            'code': 'NtCodeIFB',
            'file': 'NtString',
            'saveRegRange': 'NtString',
            'saveBufRange': 'NtString',
        }
    },
    {
        'name': 'Fluid',
        'code': // GeissFluid......................
        [0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75, 0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: sizeInt,
        }
    },
    {
        'name': 'Picture II',
        'code': // Picture II......................
        [0x50, 0x69, 0x63, 0x74, 0x75, 0x72, 0x65, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'image': ['NtString', 260],
            'blendMode': ['BlendmodePicture2', sizeInt],
            'onBeatOutput': ['BlendmodePicture2', sizeInt],
            'bilinear': ['Bool', sizeInt],
            'onBeatBilinear': ['Bool', sizeInt],
            'adjustBlend': sizeInt,
            'onBeatAdjustBlend': sizeInt,
        }
    },
    {
        'name': 'MultiFilter',
        'code': // Jheriko : MULTIFILTER...........
        [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20, 0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46, 0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'effect': ['MultiFilterEffect', sizeInt],
            'onBeat': ['Bool', sizeInt],
            null0: ['Bool', sizeInt]
        }
    },
    {
        'name': 'Particle System',
        'code': // ParticleSystem..................
        [0x50, 0x61, 0x72, 0x74, 0x69, 0x63, 0x6C, 0x65, 0x53, 0x79, 0x73, 0x74, 0x65, 0x6D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', 1],
            'bigParticles': ['Bool', 1],
            null0: 2,
            'particles': sizeInt,
            'particles+/-': sizeInt,
            'lifetime': sizeInt,
            'lifetime+/-': sizeInt,
            null1: 32,
            'spread': 'Float',
            'initialSpeed': 'Float',
            'initialSpeed+/-': 'Float',
            'acceleration': 'Float',
            'accelerationType': ['ParticleSystemAccelerationType', sizeInt],
            'color': 'Color',
            'color+/-': 'Color',
            'colorChange3': 1,
            'colorChange2': 1,
            'colorChange1': 1,
            null2: 1,
            'colorChange+/-3': 1,
            'colorChange+/-2': 1,
            'colorChange+/-1': 1,
            null3: 1,
            'colorBounce': ['ParticleSystemColorBounce', sizeInt]
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
exports.dll = dll;
//# sourceMappingURL=components.js.map