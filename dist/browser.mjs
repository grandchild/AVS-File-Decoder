import logSymbols from 'log-symbols';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var config = {
    allFields: true,
    builtinMax: 16384,
    hiddenStrings: false,
    presetHeaderLength: 25,
    sizeInt: 4
};

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
            null0: config.sizeInt
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
            null0: config.sizeInt - 1,
            'colors': 'ColorList',
            'size': config.sizeInt,
            'rotation': config.sizeInt
        }
    },
    {
        'name': 'FadeOut',
        'code': 0x03,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'speed': config.sizeInt,
            'color': 'Color'
        }
    },
    {
        'name': 'Blitter Feedback',
        'code': 0x04,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'zoom': config.sizeInt,
            'onBeatZoom': config.sizeInt,
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', config.sizeInt],
            'bilinear': ['Bool', config.sizeInt]
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
            'clearBeats': config.sizeInt
        }
    },
    {
        'name': 'Blur',
        'code': 0x06,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'blur': ['Map4', { 0: 'NONE', 1: 'MEDIUM', 2: 'LIGHT', 3: 'HEAVY' }],
            'round': ['Map4', { 0: 'DOWN', 1: 'UP' }]
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
            null0: config.sizeInt - 1,
            'colorLeft': 'Color',
            'colorRight': 'Color',
            'mode': ['Map4', { 0: 'LINES', 1: 'TRIANGLES' }]
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
            null0: config.sizeInt - 1,
            'color': 'Color',
            'distance': config.sizeInt,
            'particleSize': config.sizeInt,
            'onBeatParticleSize': config.sizeInt,
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }]
        }
    },
    {
        'name': 'Roto Blitter',
        'code': 0x09,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'zoom': config.sizeInt,
            'rotate': config.sizeInt,
            'blendMode': ['Map4', { '0': 'REPLACE', '1': 'FIFTY_FIFTY' }],
            'onBeatReverse': ['Bool', config.sizeInt],
            'reversalSpeed': config.sizeInt,
            'onBeatZoom': config.sizeInt,
            'onBeat': ['Bool', config.sizeInt],
            'bilinear': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'SVP',
        'code': 0x0A,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'library': ['SizeString', 260]
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
            null0: config.sizeInt - 1,
            'fader1': 'Int32',
            'fader2': 'Int32',
            'fader3': 'Int32',
            'beatFader1': 'Int32',
            'beatFader2': 'Int32',
            'beatFader3': 'Int32'
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
            'level': config.sizeInt
        }
    },
    {
        'name': 'Rotating Stars',
        'code': 0x0D,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList'
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
            null0: config.sizeInt - 1,
            'colors': 'ColorList',
            'size': config.sizeInt,
            'audioSource': ['UInt32', config.sizeInt, 'AudioSource']
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
            'enabled': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Dot Grid',
        'code': 0x11,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList',
            'spacing': config.sizeInt,
            'speedX': 'Int32',
            'speedY': 'Int32',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }]
        }
    },
    {
        'name': 'Buffer Save',
        'code': 0x12,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'action': ['BufferMode', config.sizeInt],
            'bufferId': ['BufferNum', config.sizeInt],
            'blendMode': ['BlendmodeBuffer', config.sizeInt],
            'adjustBlend': config.sizeInt
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
            null0: config.sizeInt
        }
    },
    {
        'name': 'Water',
        'code': 0x14,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt]
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
            'enabled': ['Bool', config.sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'red': 'Int32',
            'green': 'Int32',
            'blue': 'Int32',
            'separate': ['Bool', config.sizeInt],
            'excludeColor': 'Color',
            'exclude': ['Bool', config.sizeInt],
            'distance': config.sizeInt
        }
    },
    {
        'name': 'Interleave',
        'code': 0x17,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'x': config.sizeInt,
            'y': config.sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onbeat': ['Bool', config.sizeInt],
            'x2': config.sizeInt,
            'y2': config.sizeInt,
            'beatDuration': config.sizeInt
        }
    },
    {
        'name': 'Grain',
        'code': 0x18,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'amount': config.sizeInt,
            'static': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Clear Screen',
        'code': 0x19,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'onlyFirst': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Mirror',
        'code': 0x1A,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'topToBottom': ['Bit', 0, 'Boolified'],
            'bottomToTop': ['Bit', 1, 'Boolified'],
            'leftToRight': ['Bit', 2, 'Boolified'],
            'rightToLeft': ['Bit', 3, 'Boolified'],
            null0: config.sizeInt - 1,
            'onBeatRandom': ['Bool', config.sizeInt],
            'smoothTransition': ['Bool', config.sizeInt],
            'transitionDuration': config.sizeInt
        }
    },
    {
        'name': 'Starfield',
        'code': 0x1B,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': config.sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'WarpSpeed': 'Float',
            'MaxStars_set': config.sizeInt,
            'onbeat': config.sizeInt,
            'spdBeat': 'Float',
            'durFrames': config.sizeInt
        }
    },
    {
        'name': 'Text',
        'code': 0x1C,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', config.sizeInt],
            'insertBlanks': ['Bool', config.sizeInt],
            'randomPosition': ['Bool', config.sizeInt],
            'verticalAlign': ['Map4', { '0': 'TOP', '4': 'CENTER', '8': 'BOTTOM' }],
            'horizontalAlign': ['Map4', { '0': 'LEFT', '1': 'CENTER', '2': 'RIGHT' }],
            'onBeatSpeed': config.sizeInt,
            'normSpeed': config.sizeInt,
            null0: 60,
            // Win LOGFONT structure, 60bytes, this is more interesting:
            null1: config.sizeInt * 4,
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
            'outline': ['Bool', config.sizeInt],
            'outlineColor': 'Color',
            'shiftX': config.sizeInt,
            'shiftY': config.sizeInt,
            'outlineShadowSize': config.sizeInt,
            'randomWord': ['Bool', config.sizeInt],
            'shadow': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Bump',
        'code': 0x1D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'onBeat': ['Bool', config.sizeInt],
            'duration': config.sizeInt,
            'depth': config.sizeInt,
            'onBeatDepth': config.sizeInt,
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'code': 'CodeFBI',
            'showDot': ['Bool', config.sizeInt],
            'invertDepth': ['Bool', config.sizeInt],
            null0: config.sizeInt,
            'depthBuffer': ['BufferNum', config.sizeInt]
        }
    },
    {
        'name': 'Mosaic',
        'code': 0x1E,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'squareSize': config.sizeInt,
            'onBeatSquareSize': config.sizeInt,
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatSizeChange': ['Bool', config.sizeInt],
            'onBeatSizeDuration': config.sizeInt
        }
    },
    {
        'name': 'Water Bump',
        'code': 0x1F,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'density': config.sizeInt,
            'depth': config.sizeInt,
            'random': ['Bool', config.sizeInt],
            'dropPositionX': config.sizeInt,
            'dropPositionY': config.sizeInt,
            'dropRadius': config.sizeInt,
            'method': config.sizeInt
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
            'enabled': ['Bool', config.sizeInt],
            'mode': ['RadioButton', { 0: 'ARBITRARY', 1: 'SKIP', 2: 'REVERSE' }],
            'arbitraryValue': config.sizeInt,
            'skipValue': config.sizeInt,
            'skipFirstBeats': config.sizeInt
        }
    },
    {
        'name': 'Picture',
        'code': 0x22,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'adapt': config.sizeInt,
            'onBeatPersist': config.sizeInt,
            'file': 'NtString',
            'ratio': config.sizeInt,
            'aspectRatioAxis': ['Map4', { 0: 'X', 1: 'Y' }]
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
            'bilinear': ['Bool', config.sizeInt]
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
            'drawMode': ['DrawMode', config.sizeInt]
        }
    },
    {
        'name': 'Invert',
        'code': 0x25,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Unique Tone',
        'code': 0x26,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'invert': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Timescope',
        'code': 0x27,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'audioChannel': ['UInt32', config.sizeInt, 'AudioChannel'],
            'bands': config.sizeInt
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
            'enabled': ['Bit', 7, 'Boolified']
        }
    },
    {
        'name': 'Interferences',
        'code': 0x29,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'numberOfLayers': config.sizeInt,
            null0: config.sizeInt,
            'distance': config.sizeInt,
            'alpha': config.sizeInt,
            'rotation': 'Int32',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatDistance': config.sizeInt,
            'onBeatAlpha': config.sizeInt,
            'onBeatRotation': config.sizeInt,
            'separateRGB': ['Bool', config.sizeInt],
            'onBeat': ['Bool', config.sizeInt],
            'speed': 'Float'
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
            'bilinear': ['Bool', config.sizeInt]
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
            'bFilter': ['Bool', config.sizeInt],
            'coord': ['Coordinates', config.sizeInt],
            'gridW': config.sizeInt,
            'gridH': config.sizeInt,
            'blend': ['Bool', config.sizeInt],
            'wrap': ['Bool', config.sizeInt],
            'buffer': ['BufferNum', config.sizeInt],
            'alphaOnly': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Fast Brightness',
        'code': 0x2C,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'factor': ['Map4', { 0: 2, 1: 0.5, 2: 1 }]
        }
    },
    {
        'name': 'Color Modifier',
        'code': 0x2D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'recomputeEveryFrame': ['Bool', 1],
            'code': 'CodePFBI'
        }
    },
];
//// APEs
var dll = [
    {
        'name': 'AVS Trans Automation',
        'code': // Misc: AVSTrans Automation.......
        [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'logging': ['Bool', config.sizeInt],
            'translateFirstLevel': ['Bool', config.sizeInt],
            'readCommentCodes': ['Bool', config.sizeInt],
            'code': 'NtString'
        }
    },
    {
        'name': 'Texer',
        'code': // Texer...........................
        [0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: config.sizeInt * 4,
            'image': ['SizeString', 260],
            'input': ['Bit', 0, 'BlendmodeIn'],
            'blendMode': ['Bit', 2, 'BlendmodeTexer'],
            null1: 3,
            'particles': config.sizeInt,
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
            null0: config.sizeInt,
            'imageSrc': ['SizeString', 260],
            'resizing': ['Bool', config.sizeInt],
            'wrapAround': ['Bool', config.sizeInt],
            'colorFiltering': ['Bool', config.sizeInt],
            null1: config.sizeInt,
            'code': 'CodeIFBP'
        }
    },
    {
        'name': 'Color Map',
        'code': // Color Map.......................
        [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'key': ['ColorMapKey', config.sizeInt],
            'blendMode': ['BlendmodeColorMap', config.sizeInt],
            'mapCycleMode': ['ColorMapCycleMode', config.sizeInt],
            'adjustBlend': 1,
            null0: 1,
            'dontSkipFastBeats': ['Bool', 1],
            'cycleSpeed': 1,
            'maps': 'ColorMaps'
        }
    },
    {
        'name': 'Framerate Limiter',
        'code': // VFX FRAMERATE LIMITER...........
        [0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'limit': config.sizeInt
        }
    },
    {
        'name': 'Convolution Filter',
        'code': // Holden03: Convolution Filter....
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'edgeMode': ['ConvolutionEdgeMode', config.sizeInt],
            'absolute': ['Bool', config.sizeInt],
            'twoPass': ['Bool', config.sizeInt],
            'kernel': ['ConvoFilter', [7, 7]],
            'bias': 'Int32',
            'scale': 'Int32'
        }
    },
    {
        'name': 'Triangle',
        'code': // Render: Triangle................
        [0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20, 0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'code': 'NtCodeIFBP'
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
            'onBeatRandom': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Normalize',
        'code': // Trans: Normalise................
        [0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E, 0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Video Delay',
        'code': // Holden04: Video Delay...........
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34, 0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'useBeats': ['Bool', config.sizeInt],
            'delay': config.sizeInt
        }
    },
    {
        'name': 'Multiplier',
        'code': // Multiplier......................
        [0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'multiply': ['Map4', { 0: 'INFINITE_ROOT', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'INFINITE_SQUARE' }]
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
            'colors': ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }]
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
            'activeBuffer': config.sizeInt,
            'useBeats0': ['Bool', config.sizeInt],
            'delay0': config.sizeInt,
            'useBeats1': ['Bool', config.sizeInt],
            'delay1': config.sizeInt,
            'useBeats2': ['Bool', config.sizeInt],
            'delay2': config.sizeInt,
            'useBeats3': ['Bool', config.sizeInt],
            'delay3': config.sizeInt,
            'useBeats4': ['Bool', config.sizeInt],
            'delay4': config.sizeInt,
            'useBeats5': ['Bool', config.sizeInt],
            'delay5': config.sizeInt
        }
    },
    {
        'name': 'Buffer Blend',
        'code': // Misc: Buffer blend..............
        [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65, 0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'bufferB': ['BufferBlendBuffer', config.sizeInt],
            'bufferA': ['BufferBlendBuffer', config.sizeInt],
            'mode': ['BufferBlendMode', config.sizeInt]
        }
    },
    {
        'name': 'MIDI Trace',
        'code': // Nullsoft Pixelcorps: MIDItrace .
        [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F, 0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44, 0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'channel': config.sizeInt,
            'mode': ['Map4', { 1: 'CURRENT', 2: 'TRIGGER' }],
            'allChannels': ['Bool', config.sizeInt],
            'printEvents': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'Add Borders',
        'code': // Virtual Effect: Addborders......
        [0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20, 0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65, 0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'color': 'Color',
            'size': config.sizeInt
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
            'enabled': ['Bool', config.sizeInt]
        }
    },
    {
        'name': 'FyrewurX',
        'code': // FunkyFX FyrewurX v1.............
        [0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20, 0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58, 0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt]
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
            null0: config.sizeInt * 6,
            'code': 'NtCodeIFB',
            'file': 'NtString',
            'saveRegRange': 'NtString',
            'saveBufRange': 'NtString'
        }
    },
    {
        'name': 'Fluid',
        'code': // GeissFluid......................
        [0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75, 0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: config.sizeInt
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
            'blendMode': ['BlendmodePicture2', config.sizeInt],
            'onBeatOutput': ['BlendmodePicture2', config.sizeInt],
            'bilinear': ['Bool', config.sizeInt],
            'onBeatBilinear': ['Bool', config.sizeInt],
            'adjustBlend': config.sizeInt,
            'onBeatAdjustBlend': config.sizeInt
        }
    },
    {
        'name': 'MultiFilter',
        'code': // Jheriko : MULTIFILTER...........
        [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20, 0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46, 0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', config.sizeInt],
            'effect': ['MultiFilterEffect', config.sizeInt],
            'onBeat': ['Bool', config.sizeInt],
            null0: ['Bool', config.sizeInt]
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
            'particles': config.sizeInt,
            'particles+/-': config.sizeInt,
            'lifetime': config.sizeInt,
            'lifetime+/-': config.sizeInt,
            null1: 32,
            'spread': 'Float',
            'initialSpeed': 'Float',
            'initialSpeed+/-': 'Float',
            'acceleration': 'Float',
            'accelerationType': ['ParticleSystemAccelerationType', config.sizeInt],
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
            'colorBounce': ['ParticleSystemColorBounce', config.sizeInt]
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

var isNode = new Function('try {return this===global;}catch(e){return false;}');
var Log = {
    log: function (message) {
        console.log(message);
    },
    info: function (message) {
        console.info((isNode) ? (logSymbols.info, message) : message);
    },
    error: function (message) {
        console.error((isNode) ? (logSymbols.error, message) : message);
    },
    success: function (message) {
        console.log((isNode) ? (logSymbols.success, message) : message);
    },
    warn: function (message) {
        console.warn((isNode) ? (logSymbols.warning, message) : message);
    }
};

var get = {
    Bit: function (blob, offset, pos) {
        if (pos.length) {
            if (pos.length !== 2) {
                throw new this.ConvertException("Invalid Bitfield range " + pos + ".");
            }
            var mask = (2 << (pos[1] - pos[0])) - 1;
            return [(blob[offset] >> pos[0]) & mask, 1];
        }
        else {
            return [((blob[offset] >> pos) & 1), 1];
        }
    },
    UInt: function (blob, offset, size) {
        if (offset > blob.length - size) {
            Log.warn("WARNING: getUInt: offset overflow " + offset + " > " + (blob.length - size));
            return 0;
        }
        switch (size) {
            case 1:
                return blob[offset];
            case config.sizeInt:
                return this.UInt32(blob, offset);
            case config.sizeInt * 2:
                return this.UInt64(blob, offset);
            default:
                throw new ConvertException("Invalid integer size '" + size + "', only 1, " + config.sizeInt + " and " + config.sizeInt * 2 + " allowed.");
        }
    },
    UInt32: function (blob, offset) {
        if (offset === void 0) { offset = 0; }
        if (offset > blob.length - config.sizeInt) {
            Log.warn("WARNING: getUInt32: offset overflow " + offset + " > " + (blob.length - config.sizeInt));
            return 0;
        }
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
        try {
            return new Uint32Array(array, 0, 1)[0];
        }
        catch (e) {
            if (e instanceof RangeError) {
                Log.error(e.stack);
                throw new ConvertException("Invalid offset " + offset + " to getUInt32.\nIs this preset very old? Send it in, so we can look at it!");
            }
            else {
                throw e;
            }
        }
    },
    Int32: function (blob, offset) {
        if (offset === void 0) { offset = 0; }
        if (offset > blob.length - config.sizeInt) {
            Log.warn("WARNING: getInt32: offset overflow " + offset + " > " + (blob.length - config.sizeInt));
            return [0, config.sizeInt];
        }
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
        try {
            return [new Int32Array(array, 0, 1)[0], config.sizeInt];
        }
        catch (e) {
            if (e instanceof RangeError) {
                throw new ConvertException("Invalid offset " + offset + " to getInt32.\nIs this preset very old? Send it in, so we can look at it!");
            }
            else {
                throw e;
            }
        }
    },
    UInt64: function (blob, offset) {
        if (offset === void 0) { offset = 0; }
        if (offset > blob.length - config.sizeInt * 2) {
            Log.warn("WARNING: getUInt64: offset overflow " + offset + " > " + (blob.length - config.sizeInt * 2));
            return 0;
        }
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt * 2);
        try {
            var two32 = new Uint32Array(array, 0, 2);
            return two32[0] + two32[1] * 0x100000000;
        }
        catch (e) {
            if (e instanceof RangeError) {
                throw new ConvertException("Invalid offset " + offset + " to getUInt64.\nIs this preset very old? Send it in, so we can look at it!");
            }
            else {
                throw e;
            }
        }
    },
    Float: function (blob, offset) {
        if (offset === void 0) { offset = 0; }
        var array = blob.buffer.slice(blob.byteOffset + offset, blob.byteOffset + offset + config.sizeInt);
        try {
            return [new Float32Array(array, 0, 1)[0], 4];
        }
        catch (e) {
            if (e instanceof RangeError) {
                throw new ConvertException("Invalid offset " + offset + " to getFloat.\nIs this preset very old? Send it in, so we can look at it!");
            }
            else {
                throw e;
            }
        }
    },
    Bool: function (blob, offset, size) {
        var val = size === 1 ? blob[offset] : this.UInt32(blob, offset);
        return [val !== 0, size];
    },
    Boolified: function (num) {
        return num === 0 ? false : true;
    },
    SizeString: function (blob, offset, size) {
        var add = 0;
        var result = '';
        var getHidden = false;
        if (!size) {
            size = this.UInt32(blob, offset);
            add = config.sizeInt;
        }
        else {
            getHidden = config.hiddenStrings;
        }
        var end = offset + size + add;
        var i = offset + add;
        var c = blob[i];
        while (c > 0 && i < end) {
            result += String.fromCharCode(c);
            c = blob[++i];
        }
        var hidden = [];
        if (getHidden) {
            hidden = this.HiddenStrings(blob, i, end);
        }
        if (hidden.length === 0) {
            return [result, size + add];
        }
        else {
            return [result, size + add, hidden];
        }
    },
    HiddenStrings: function (blob, i, end) {
        var nonPrintables = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            127, 129, 141, 143, 144, 157, 173
        ];
        var hidden = [];
        while (i < end) {
            var c = blob[i];
            var s = '';
            while (nonPrintables.indexOf(c) < 0 && i < end) {
                s += String.fromCharCode(c);
                c = blob[++i];
            }
            i++;
            // mostly of interest might be (lost) code, and thus check for '=' to
            // weed out a lot of random uninteresting strings.
            // TODO: more sophisticated filter
            if (s.length > 4 && s.indexOf('=') >= 0) {
                hidden.push(s);
            }
        }
        return hidden;
    },
    NtString: function (blob, offset) {
        var result = '';
        var i = offset;
        var c = blob[i];
        while (c > 0) {
            result += String.fromCharCode(c);
            c = blob[++i];
        }
        return [result, i - offset + 1];
    },
    Map1: function (blob, offset, map) {
        return [this.Mapping(map, blob[offset]), 1];
    },
    Map4: function (blob, offset, map) {
        return [this.Mapping(map, this.UInt32(blob, offset)), config.sizeInt];
    },
    Map8: function (blob, offset, map) {
        return [this.Mapping(map, this.UInt64(blob, offset)), config.sizeInt * 2];
    },
    RadioButton: function (blob, offset, map) {
        var key = 0;
        for (var i = 0; i < map.length; i++) {
            var on = this.UInt32(blob, offset + config.sizeInt * i) !== 0 ? 1 : 0;
            if (on) { // in case of (erroneous) multiple selections, the last one selected wins
                key = on * (i + 1);
            }
        }
        return [this.Mapping(map, key), config.sizeInt * map.length];
    },
    Mapping: function (map, key) {
        var value = map[key];
        if (value === undefined) {
            throw new ConvertException("Map: A value for key '" + key + "' does not exist.");
        }
        else {
            return value;
        }
    },
    // Point, Frame, Beat, Init code fields - reorder to I,F,B,P order.
    CodePFBI: function (blob, offset) {
        var map = [
            ['init', 3],
            ['perFrame', 1],
            ['onBeat', 2],
            ['perPoint', 0],
        ];
        return this.CodeSection(blob, offset, map);
    },
    // Frame, Beat, Init code fields - reorder to I,F,B order.
    CodeFBI: function (blob, offset) {
        var map = [
            ['init', 2],
            ['perFrame', 1],
            ['onBeat', 0],
        ];
        return this.CodeSection(blob, offset, map);
    },
    CodeIFBP: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
            ['onBeat', 2],
            ['perPoint', 3],
        ];
        return this.CodeSection(blob, offset, map);
    },
    CodeIFB: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
            ['onBeat', 2],
        ];
        return this.CodeSection(blob, offset, map);
    },
    // used by 2.8+ 'Effect List'
    CodeEIF: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
        ];
        var code = this.CodeSection(blob, offset, map);
        return [{
                'enabled': this.Bool(blob, offset, config.sizeInt)[0],
                'init': code[0]['init'],
                'perFrame': code[0]['perFrame']
            }, code[1]];
    },
    // used only by 'Global Variables'
    NtCodeIFB: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
            ['onBeat', 2],
        ];
        return this.CodeSection(blob, offset, map, /*nullterminated*/ true);
    },
    // used only by 'Triangle'
    NtCodeIFBP: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
            ['onBeat', 2],
            ['perPoint', 3],
        ];
        return this.CodeSection(blob, offset, map, /*nullterminated*/ true);
    },
    // the 256*-functions are used by ancient versions of 'Super Scope', 'Dynamic Movement', 'Dynamic Distance Modifier', 'Dynamic Shift'
    LegacyCodePFBI: function (blob, offset) {
        var map = [
            ['init', 3],
            ['perFrame', 1],
            ['onBeat', 2],
            ['perPoint', 0],
        ];
        return this.CodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LegacyCodeIFB: function (blob, offset) {
        var map = [
            ['init', 0],
            ['perFrame', 1],
            ['onBeat', 2],
        ];
        return this.CodeSection(blob, offset, map, /*nullterminated*/ false, /*string max length*/ 256);
    },
    CodeSection: function (blob, offset, map, nt, fixedSize) {
        if (nt === void 0) { nt = false; }
        var strings = new Array(map.length);
        var totalSize = 0;
        var strAndSize;
        var hidden = [];
        for (var i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
            strAndSize = nt ? this.NtString(blob, p) : this.SizeString(blob, p, fixedSize);
            totalSize += strAndSize[1];
            strings[i] = strAndSize[0];
            if (strAndSize.length > 2) {
                hidden = hidden.concat(strAndSize[2]);
            }
        }
        var code = {};
        for (var i = 0; i < strings.length; i++) {
            code[map[i][0]] = strings[map[i][1]];
        }
        if (hidden.length > 0) {
            code['_hidden'] = hidden;
        }
        return [code, totalSize];
    },
    ColorList: function (blob, offset) {
        var colors = [];
        var num = this.UInt32(blob, offset);
        var size = config.sizeInt + num * config.sizeInt;
        while (num > 0) {
            offset += config.sizeInt;
            colors.push(this.Color(blob, offset)[0]);
            num--;
        }
        return [colors, size];
    },
    ColorMaps: function (blob, offset) {
        var mapOffset = offset + 480;
        var maps = [];
        var headerSize = 60; // 4B enabled, 4B num, 4B id, 48B filestring
        var mi = 0; // map index, might be != i when maps are skipped
        for (var i = 0; i < 8; i++) {
            var enabled = this.Bool(blob, offset + headerSize * i, config.sizeInt)[0];
            var num = this.UInt32(blob, offset + headerSize * i + config.sizeInt);
            var map = this.ColorMap(blob, mapOffset, num);
            // check if it's a disabled default {0: #000000, 255: #ffffff} map, and only save it if not.
            if (!enabled && map.length === 2 && map[0].color === '#000000' && map[0].position === 0 && map[1].color === '#ffffff' && map[1].position === 255) ;
            else {
                maps[mi] = {
                    'index': i,
                    'enabled': enabled,
                    'colors': map
                };
                {
                    var id = this.UInt32(blob, offset + headerSize * i + config.sizeInt * 2); // id of the map - not really needed.
                    var mapFile = this.NtString(blob, offset + headerSize * i + config.sizeInt * 3)[0];
                    maps[mi]['id'] = id;
                    maps[mi]['fileName'] = mapFile;
                }
                mi++;
            }
            mapOffset += num * config.sizeInt * 3;
        }
        return [maps, mapOffset - offset];
    },
    ColorMap: function (blob, offset, num) {
        var colorMap = [];
        for (var i = 0; i < num; i++) {
            var pos = this.UInt32(blob, offset);
            var color = this.Color(blob, offset + config.sizeInt)[0];
            offset += config.sizeInt * 3; // there's a 4byte id (presumably) following each color.
            colorMap[i] = { 'color': color, 'position': pos };
        }
        return colorMap;
    },
    Color: function (blob, offset) {
        // Colors in AVS are saved as (A)RGB (where A is always 0).
        // Maybe one should use an alpha channel right away and set
        // that to 0xff? For now, no 4th byte means full alpha.
        var color = this.UInt32(blob, offset).toString(16);
        var padding = '';
        for (var i = color.length; i < 6; i++) {
            padding += '0';
        }
        return ['#' + padding + color, config.sizeInt];
    },
    ConvoFilter: function (blob, offset, dimensions) {
        var size = dimensions[0] * dimensions[1];
        var data = new Array(size);
        for (var i = 0; i < size; i++, offset += config.sizeInt) {
            data[i] = this.Int32(blob, offset)[0];
        }
        var matrix = { 'width': dimensions[0], 'height': dimensions[1], 'data': data };
        return [matrix, size * config.sizeInt];
    },
    // 'Text' needs this
    SemiColSplit: function (str) {
        var strings = str.split(';');
        if (strings.length === 1) {
            return strings[0];
        }
        else {
            return strings;
        }
    },
    BufferNum: function (code) {
        if (code === 0) {
            return 'Current';
        }
        return code;
    }
};

// Modules
var setHiddenStrings = function (value) { config.hiddenStrings = value; };
var ConvertException = /** @class */ (function () {
    function ConvertException(msg) {
        this.msg = msg;
        this.name = 'ConvertException';
        this.message = msg;
    }
    ConvertException.prototype.toString = function () {
        return this.name + " : " + this.message;
    };
    return ConvertException;
}());
function cmpBytes(arr, offset, test) {
    for (var i = 0; i < test.length; i++) {
        if (test[i] === null) {
            continue; // null means 'any value' - a letiable
        }
        if (arr[i + offset] !== test[i]) {
            return false;
        }
    }
    return true;
}
function callFunction(funcName, blobOrValue, offset, extra) {
    try {
        if (blobOrValue instanceof Uint8Array) {
            return get[funcName](blobOrValue, offset, extra);
        }
        else {
            return get[funcName](blobOrValue);
        }
    }
    catch (e) {
        if (e.message.search(/not a function|has no method/) >= 0) {
            throw new ConvertException("Method or table '" + ('get' + funcName) + "' was not found. Correct capitalization?");
        }
        else {
            throw e;
        }
    }
}
function removeSpaces(str) {
    return str.replace(/[ ]/g, '');
}
function lowerInitial(str) {
    return str[0].toLowerCase() + str.slice(1);
}

var Table = {
    blendmodeIn: {
        '0': 'IGNORE',
        '1': 'REPLACE',
        '2': 'FIFTY_FIFTY',
        '3': 'MAXIMUM',
        '4': 'ADDITIVE',
        '5': 'SUB_DEST_SRC',
        '6': 'SUB_SRC_DEST',
        '7': 'EVERY_OTHER_LINE',
        '8': 'EVERY_OTHER_PIXEL',
        '9': 'XOR',
        '10': 'ADJUSTABLE',
        '11': 'MULTIPLY',
        '12': 'BUFFER'
    },
    blendmodeOut: {
        '0': 'REPLACE',
        '1': 'IGNORE',
        '2': 'MAXIMUM',
        '3': 'FIFTY_FIFTY',
        '4': 'SUB_DEST_SRC',
        '5': 'ADDITIVE',
        '6': 'EVERY_OTHER_LINE',
        '7': 'SUB_SRC_DEST',
        '8': 'XOR',
        '9': 'EVERY_OTHER_PIXEL',
        '10': 'MULTIPLY',
        '11': 'ADJUSTABLE',
        // don't ask me....
        '13': 'BUFFER'
    },
    blendmodeBuffer: {
        '0': 'REPLACE',
        '1': 'FIFTY_FIFTY',
        '2': 'ADDITIVE',
        '3': 'EVERY_OTHER_PIXEL',
        '4': 'SUB_DEST_SRC',
        '5': 'EVERY_OTHER_LINE',
        '6': 'XOR',
        '7': 'MAXIMUM',
        '8': 'MINIMUM',
        '9': 'SUB_SRC_DEST',
        '10': 'MULTIPLY',
        '11': 'ADJUSTABLE'
    },
    blendmodeRender: {
        '0': 'REPLACE',
        '1': 'ADDITIVE',
        '2': 'MAXIMUM',
        '3': 'FIFTY_FIFTY',
        '4': 'SUB_DEST_SRC',
        '5': 'SUB_SRC_DEST',
        '6': 'MULTIPLY',
        '7': 'ADJUSTABLE',
        '8': 'XOR'
    },
    blendmodePicture2: {
        '0': 'REPLACE',
        '1': 'ADDITIVE',
        '2': 'MAXIMUM',
        '3': 'MINIMUM',
        '4': 'FIFTY_FIFTY',
        '5': 'SUB_DEST_SRC',
        '6': 'SUB_SRC_DEST',
        '7': 'MULTIPLY',
        '8': 'XOR',
        '9': 'ADJUSTABLE',
        '10': 'IGNORE'
    },
    blendmodeColorMap: {
        '0': 'REPLACE',
        '1': 'ADDITIVE',
        '2': 'MAXIMUM',
        '3': 'MINIMUM',
        '4': 'FIFTY_FIFTY',
        '5': 'SUB_DEST_SRC',
        '6': 'SUB_SRC_DEST',
        '7': 'MULTIPLY',
        '8': 'XOR',
        '9': 'ADJUSTABLE'
    },
    blendmodeTexer: {
        '0': 'TEXTURE',
        '1': 'MASKED_TEXTURE'
    },
    colorMapKey: {
        '0': 'RED',
        '1': 'GREEN',
        '2': 'BLUE',
        '3': 'CHANNEL_SUM_HALF',
        '4': 'MAX',
        '5': 'CHANNEL_AVERAGE'
    },
    colorMapCycleMode: {
        '0': 'SINGLE',
        '1': 'ONBEAT_RANDOM',
        '2': 'ONBEAT_SEQUENTIAL'
    },
    bufferMode: {
        '0': 'SAVE',
        '1': 'RESTORE',
        '2': 'ALTERNATE_SAVE_RESTORE',
        '3': 'ALTERNATE_RESTORE_SAVE'
    },
    coordinates: {
        '0': 'POLAR',
        '1': 'CARTESIAN'
    },
    drawMode: {
        '0': 'DOTS',
        '1': 'LINES'
    },
    audioChannel: {
        '0': 'LEFT',
        '1': 'RIGHT',
        '2': 'CENTER'
    },
    audioSource: {
        '0': 'WAVEFORM',
        '1': 'SPECTRUM'
    },
    positionX: {
        '0': 'LEFT',
        '1': 'RIGHT',
        '2': 'CENTER'
    },
    positionY: {
        '0': 'TOP',
        '1': 'BOTTOM',
        '2': 'CENTER'
    },
    convolutionEdgeMode: {
        '0': 'EXTEND',
        '1': 'WRAP'
    },
    multiFilterEffect: {
        '0': 'CHROME',
        '1': 'DOUBLE_CHROME',
        '2': 'TRIPLE_CHROME',
        '3': 'INFINITE_ROOT_MULTIPLIER_AND_SMALL_BORDER_CONVOLUTION'
    },
    bufferBlendMode: {
        '0': 'REPLACE',
        '1': 'ADDITIVE',
        '2': 'MAXIMUM',
        '3': 'FIFTY_FIFTY',
        '4': 'SUB_DEST_SRC',
        '5': 'SUB_SRC_DEST',
        '6': 'MULTIPLY',
        '7': 'ADJUSTABLE',
        '8': 'XOR',
        '9': 'MINIMUM',
        '10': 'ABSOLUTE_DIFFERENCE'
    },
    bufferBlendBuffer: {
        '0': 'buffer1',
        '1': 'buffer2',
        '2': 'buffer3',
        '3': 'buffer4',
        '4': 'buffer5',
        '5': 'buffer6',
        '6': 'buffer7',
        '7': 'buffer8',
        '8': 'CURRENT'
    },
    particleSystemAccelerationType: {
        '0': 'NT',
        '1': 'FADE_OUT_BY_0_9',
        '2': 'FADE_OUT_BY_0_6',
        '3': 'COSINE',
        '4': 'SQUARED_COSINE'
    },
    particleSystemColorBounce: {
        '0': 'STOP',
        '1': 'WRAP_EACH',
        '2': 'WAVE_EACH',
        '3': 'WRAP_ALL',
        '4': 'WAVE_ALL'
    },
    // pretty much directly from vis_avs/r_trans.cpp
    // [name, script code representation (if any), 0:polar/1:cartesian]
    movementEffect: {
        '0': ['None', '', 0],
        '1': ['Slight Fuzzify', '', 0],
        '2': ['Shift Rotate Left', 'x=x+1/32, // use wrap for this one', 1],
        '3': ['Big Swirl Out', 'r = r + (0.1 - (0.2 * d)),\r\nd = d * 0.96,', 0],
        '4': ['Medium Swirl', 'd = d * (0.99 * (1.0 - sin(r-$PI*0.5) / 32.0)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
        '5': ['Sunburster', 'd = d * (0.94 + (cos((r-$PI*0.5) * 32.0) * 0.06)),', 0],
        '6': ['Swirl To Center', 'd = d * (1.01 + (cos((r-$PI*0.5) * 4) * 0.04)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
        '7': ['Blocky Partial Out', '', 0],
        '8': ['Swirling Around Both Ways At Once', 'r = r + (0.1 * sin(d * $PI * 5)),', 0],
        '9': ['Bubbling Outward', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),', 0],
        '10': ['Bubbling Outward With Swirl', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),\r\nt=cos(d*$PI/2.0),\r\nr= r + 0.1*t*t*t,', 0],
        '11': ['5 Pointed Distro', 'd = d * (0.95 + (cos(((r-$PI*0.5) * 5.0) - ($PI / 2.50)) * 0.03)),', 0],
        '12': ['Tunneling', 'r = r + 0.04,\r\nd = d * (0.96 + cos(d * $PI) * 0.05),', 0],
        '13': ['Bleedin\'', 't = cos(d * $PI),\r\nr = r + (0.07 * t),\r\nd = d * (0.98 + t * 0.10),', 0],
        '14': ['Shifted Big Swirl Out', 'd=sqrt(x*x+y*y), r=atan2(y,x),\r\nr=r+0.1-0.2*d, d=d*0.96,\r\nx=cos(r)*d + 8/128, y=sin(r)*d,', 1],
        '15': ['Psychotic Beaming Outward', 'd = 0.15', 0],
        '16': ['Cosine Radial 3-way', 'r = cos(r * 3)', 0],
        '17': ['Spinny Tube', 'd = d * (1 - ((d - .35) * .5)),\r\nr = r + .1,', 0],
        '18': ['Radial Swirlies', 'd = d * (1 - (sin((r-$PI*0.5) * 7) * .03)),\r\nr = r + (cos(d * 12) * .03),', 0],
        '19': ['Swill', 'd = d * (1 - (sin((r - $PI*0.5) * 12) * .05)),\r\nr = r + (cos(d * 18) * .05),\r\nd = d * (1-((d - .4) * .03)),\r\nr = r + ((d - .4) * .13)', 0],
        '20': ['Gridley', 'x = x + (cos(y * 18) * .02),\r\ny = y + (sin(x * 14) * .03),', 1],
        '21': ['Grapevine', 'x = x + (cos(abs(y-.5) * 8) * .02),\r\ny = y + (sin(abs(x-.5) * 8) * .05),\r\nx = x * .95,\r\ny = y * .95,', 1],
        '22': ['Quadrant', 'y = y * ( 1 + (sin(r + $PI/2) * .3) ),\r\nx = x * ( 1 + (cos(r + $PI/2) * .3) ),\r\nx = x * .995,\r\ny = y * .995,', 1],
        '23': ['6-way Kaleida (use Wrap!)', 'y = (r*6)/($PI), x = d,', 1]
    }
};

var decode = {
    presetHeader: function (blob) {
        var presetHeader0_1 = [
            0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
            0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
            0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x31, 0x1A
        ];
        var presetHeader0_2 = [
            0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
            0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
            0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,
        ];
        if (!cmpBytes(blob, /*offset*/ 0, presetHeader0_2) &&
            !cmpBytes(blob, /*offset*/ 0, presetHeader0_1)) { // 0.1 only if 0.2 failed because it's far rarer.
            throw new ConvertException('Invalid preset header.\n' +
                '  This does not seem to be an AVS preset file.\n' +
                '  If it does load with Winamp\'s AVS please send the file in so we can look at it.');
        }
        return blob[config.presetHeaderLength - 1] === 1; // 'Clear Every Frame'
    },
    //// component decode ,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effectList: function (blob, offset, _, name) {
        var size = get.UInt32(blob, offset - config.sizeInt);
        var comp = {
            'type': removeSpaces(name),
            'enabled': get.Bit(blob, offset, 1)[0] !== 1,
            'clearFrame': get.Bit(blob, offset, 0)[0] === 1,
            'input': Table['blendmodeIn'][blob[offset + 2]],
            'output': Table['blendmodeOut'][blob[offset + 3]]
        };
        var modebit = get.Bit(blob, offset, 7)[0] === 1; // is true in all presets I know, probably only for truly ancient versions
        if (!modebit) {
            Log.error('EL modebit is off!! If you\'re seeing this, send this .avs file in please!');
        }
        var configSize = (modebit ? blob[offset + 4] : blob[offset]) + 1;
        if (configSize > 1) {
            comp['inAdjustBlend'] = get.UInt32(blob, offset + 5);
            comp['outAdjustBlend'] = get.UInt32(blob, offset + 9);
            comp['inBuffer'] = get.UInt32(blob, offset + 13);
            comp['outBuffer'] = get.UInt32(blob, offset + 17);
            comp['inBufferInvert'] = get.UInt32(blob, offset + 21) === 1;
            comp['outBufferInvert'] = get.UInt32(blob, offset + 25) === 1;
            comp['enableOnBeat'] = get.UInt32(blob, offset + 29) === 1;
            comp['enableOnBeatFor'] = get.UInt32(blob, offset + 33);
        }
        var effectList28plusHeader = [
            0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
            0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
            0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
            0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
            0x00, 0x00, 0x00, 0x00
        ];
        var contentOffset = offset + configSize;
        if (cmpBytes(blob, contentOffset, effectList28plusHeader)) {
            var codeOffset = offset + configSize + effectList28plusHeader.length;
            var codeSize = get.UInt32(blob, codeOffset);
            comp['code'] = get.CodeEIF(blob, codeOffset + config.sizeInt)[0];
            contentOffset = codeOffset + config.sizeInt + codeSize;
        }
        var content = convertComponents(blob.subarray(contentOffset, offset + size));
        comp['components'] = content;
        return comp;
    },
    // generic field decoding function that most components use.
    generic: function (blob, offset, fields, name, group, end) {
        var comp = {
            'type': removeSpaces(name),
            'group': group
        };
        var keys = Object.keys(fields);
        var lastWasABitField = false;
        for (var i = 0; i < keys.length; i++) {
            if (offset >= end) {
                break;
            }
            var k = keys[i];
            var f = fields[k];
            // console.log(`key: ${k}, field: ${f}`);
            if (k.match(/^null[_0-9]*$/)) {
                offset += f;
                // 'null_: 0' resets bitfield continuity to allow several consecutive bitfields
                lastWasABitField = false;
                continue;
            }
            var size = 0;
            var value = void 0;
            var result = void 0;
            var num = typeof f === 'number';
            var other = typeof f === 'string';
            var array = f instanceof Array;
            if (num) {
                size = f;
                try {
                    value = get.UInt(blob, offset, size);
                }
                catch (e) {
                    throw new ConvertException('Invalid field size: ' + f + '.');
                }
                lastWasABitField = false;
            }
            else if (other) {
                // const func = 'get' + f;
                // console.log(`get: ${f}`);
                result = callFunction(f, blob, offset);
                value = result[0];
                size = result[1];
                lastWasABitField = false;
            }
            else if (array && f.length >= 2) {
                if (f[0] === 'Bit') {
                    if (lastWasABitField) {
                        offset -= 1; // compensate to stay in same bitfield
                    }
                    lastWasABitField = true;
                }
                else {
                    lastWasABitField = false;
                }
                // console.log(`get: ${f[0]} ${f[1]} ${typeof f[1]}`);
                var tableName = lowerInitial(f[0]);
                if (tableName in Table) {
                    var tableKey = get.UInt(blob, offset, f[1]);
                    value = Table[tableName][tableKey];
                    size = f[1];
                }
                else {
                    result = callFunction(f[0], blob, offset, f[1]);
                    size = result[1];
                    value = result[0];
                }
                if (f[2]) { // further processing if wanted
                    // console.log('get' + f[2]);
                    tableName = lowerInitial(f[2]);
                    if (tableName in Table) {
                        value = Table[tableName][value];
                    }
                    else {
                        value = callFunction(f[2], value);
                    }
                }
            }
            // save value or function result of value in field
            if (k !== 'new_version') { // but don't save new_version marker, if present
                comp[k] = value;
            }
            offset += size;
        }
        return comp;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    versioned_generic: function (blob, offset, fields, name, group, end) {
        var version = blob[offset];
        if (version === 1) {
            return this.generic(blob, offset, fields, name, group, end);
        }
        else {
            var oldFields = {};
            for (var key in fields) {
                if (key === 'new_version') {
                    continue;
                }
                if (key === 'code') {
                    oldFields[key] = fields['code'].replace(/Code([IFBP]+)/, '256Code$1');
                }
                else {
                    oldFields[key] = fields[key];
                }
            }
            return this.generic(blob, offset, oldFields, name, group, end);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    movement: function (blob, offset, _, name, group, end) {
        var comp = {
            'type': name,
            'group': group
        };
        // the special value 0 is because 'old versions of AVS barf' if the id is > 15, so
        // AVS writes out 0 in that case, and sets the actual id at the end of the save block.
        var effectIdOld = get.UInt32(blob, offset);
        var effect = [];
        var code;
        var hidden;
        if (effectIdOld !== 0) {
            if (effectIdOld === 0x7fff) {
                var strAndSize = ['', 0];
                if (blob[offset + config.sizeInt] === 1) { // new-version marker
                    strAndSize = get.SizeString(blob, offset + config.sizeInt + 1);
                }
                else {
                    strAndSize = get.SizeString(blob, offset + config.sizeInt, 256);
                }
                offset += strAndSize[1];
                code = strAndSize[0];
                if (strAndSize.length > 2) {
                    hidden = strAndSize[2];
                }
            }
            else {
                if (effectIdOld > 15) {
                    {
                        Log.error("Movement: Unknown effect id " + effectIdOld + ". This is a known bug.");
                        console.log('If you know an AVS version that will display this Movement as anything else but "None", then please send it in!');
                    }
                    effect = Table.movementEffect[0];
                }
                else {
                    effect = Table.movementEffect[effectIdOld];
                }
            }
        }
        else {
            var effectIdNew = 0;
            if (offset + config.sizeInt * 6 < end) {
                effectIdNew = get.UInt32(blob, offset + config.sizeInt * 6); // 1*config.sizeInt, because of oldId=0, and 5*config.sizeint because of the other settings.
            }
            effect = Table.movementEffect[effectIdNew];
        }
        if (effect && effect.length > 0) {
            comp['builtinEffect'] = effect[0];
        }
        comp['output'] = get.UInt32(blob, offset + config.sizeInt) ? '50/50' : 'Replace';
        comp['sourceMapped'] = get.Bool(blob, offset + config.sizeInt * 2, config.sizeInt)[0];
        comp['coordinates'] = Table.coordinates[get.UInt32(blob, offset + config.sizeInt * 3)];
        comp['bilinear'] = get.Bool(blob, offset + config.sizeInt * 4, config.sizeInt)[0];
        comp['wrap'] = get.Bool(blob, offset + config.sizeInt * 5, config.sizeInt)[0];
        if (effect && effect.length && effectIdOld !== 1 && effectIdOld !== 7) { // 'slight fuzzify' and 'blocky partial out' have no script representation.
            code = effect[1];
            comp['coordinates'] = effect[2]; // overwrite
        }
        comp['code'] = code;
        if (hidden) {
            comp['_hidden'] = hidden;
        }
        return comp;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    avi: function (blob, offset) {
        var comp = {
            'type': 'AVI',
            'group': 'Render',
            'enabled': get.Bool(blob, offset, config.sizeInt)[0]
        };
        var strAndSize = get.NtString(blob, offset + config.sizeInt * 3);
        comp['file'] = strAndSize[0];
        comp['speed'] = get.UInt32(blob, offset + config.sizeInt * 5 + strAndSize[1]); // 0: fastest, 1000: slowest
        var beatAdd = get.UInt32(blob, offset + config.sizeInt * 3 + strAndSize[1]);
        if (beatAdd) {
            comp['output'] = '50/50';
        }
        else {
            comp['output'] = get.Map8(blob, offset + config.sizeInt, { 0: 'Replace', 1: 'Additive', 0x100000000: '50/50' });
        }
        comp['onBeatAdd'] = beatAdd;
        comp['persist'] = get.UInt32(blob, offset + config.sizeInt * 4 + strAndSize[1]); // 0-32
        return comp;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    simple: function (blob, offset) {
        var comp = {
            'type': 'Simple',
            'group': 'Render'
        };
        var effect = get.UInt32(blob, offset);
        if (effect & (1 << 6)) {
            comp['audioSource'] = (effect & 2) ? 'Waveform' : 'Spectrum';
            comp['renderType'] = 'Dots';
        }
        else {
            switch (effect & 3) {
                case 0: // solid analyzer
                    comp['audioSource'] = 'Spectrum';
                    comp['renderType'] = 'Solid';
                    break;
                case 1: // line analyzer
                    comp['audioSource'] = 'Spectrum';
                    comp['renderType'] = 'Lines';
                    break;
                case 2: // line scope
                    comp['audioSource'] = 'Waveform';
                    comp['renderType'] = 'Lines';
                    break;
                case 3: // solid scope
                    comp['audioSource'] = 'Waveform';
                    comp['renderType'] = 'Solid';
                    break;
            }
        }
        comp['audioChannel'] = Table.audioChannel[(effect >> 2) & 3];
        comp['positionY'] = Table.positionY[(effect >> 4) & 3];
        comp['colors'] = get.ColorList(blob, offset + config.sizeInt)[0];
        return comp;
    }
};

// Constants
var verbosity = 0; // log individual key:value fields
var componentTable = builtin.concat(dll);
var defaultArgs = {
    hidden: true,
    minify: false,
    quiet: false,
    verbose: 0
};
function convertBlob(data, presetName, presetDate, customArgs) {
    var args = __assign(__assign({}, defaultArgs), customArgs);
    verbosity = args.quiet ? -1 : args.verbose;
    setHiddenStrings(args.hidden);
    var preset = {
        'name': presetName
    };
    if (presetDate) {
        preset['date'] = presetDate;
    }
    var blob8 = new Uint8Array(data);
    try {
        var clearFrame = decode.presetHeader(blob8.subarray(0, config.presetHeaderLength));
        preset['clearFrame'] = clearFrame;
        var components = convertComponents(blob8.subarray(config.presetHeaderLength));
        preset['components'] = components;
    }
    catch (e) {
        // TODO
        // if (verbosity < 0) Log.error(`Error in '${file}'`);
        if (verbosity >= 1) {
            Log.error(e.stack);
        }
        else {
            Log.error(e);
        }
        // if(e instanceof Util.ConvertException) {
        //     Log.error('Error: '+e.message);
        //     return null;
        // } else {
        //     throw e;
        // }
    }
    return preset;
}
function convertComponents(blob) {
    var fp = 0;
    var components = [];
    var res;
    // read file as long as there are components left.
    // a component takes at least two int32s of space, if there are less bytes than that left,
    // ignore them. usually fp < blob.length should suffice but some rare presets have trailing
    // bytes. found in one preset's trailing colormap so far.
    while (fp <= blob.length - config.sizeInt * 2) {
        var code = get.UInt32(blob, fp);
        var i = getComponentIndex(code, blob, fp);
        var isDll = (code !== 0xfffffffe && code >= config.builtinMax) ? 1 : 0;
        var size = getComponentSize(blob, fp + config.sizeInt + isDll * 32);
        // console.log("component size", size, "blob size", blob.length);
        if (i < 0) {
            res = { 'type': 'Unknown: (' + (-i) + ')' };
        }
        else {
            var offset = fp + config.sizeInt * 2 + isDll * 32;
            res = decode[componentTable[i].func](blob, offset, componentTable[i].fields, componentTable[i].name, componentTable[i].group, offset + size);
        }
        if (!res || typeof res !== 'object') { // should not happen, decode functions should throw their own.
            throw new ConvertException('Unknown convert error');
        }
        components.push(res);
        fp += size + config.sizeInt * 2 + isDll * 32;
    }
    return components;
}
function getComponentIndex(code, blob, offset) {
    if (code < config.builtinMax || code === 0xfffffffe) {
        for (var i = 0; i < componentTable.length; i++) {
            if (code === componentTable[i].code) {
                if (verbosity >= 1) {
                    Log.log("Found component: " + componentTable[i].name + " (" + code + ")");
                }
                return i;
            }
        }
    }
    else {
        for (var i = builtin.length; i < componentTable.length; i++) {
            if (componentTable[i].code instanceof Array &&
                cmpBytes(blob, offset + config.sizeInt, componentTable[i].code)) {
                if (verbosity >= 1) {
                    Log.log("Found component: " + componentTable[i].name);
                }
                return i;
            }
        }
    }
    if (verbosity >= 1) {
        Log.log("Found unknown component (code: " + code + ")");
    }
    return -code;
}
function getComponentSize(blob, offset) {
    return get.UInt32(blob, offset);
}

export { convertBlob, convertComponents };
//# sourceMappingURL=browser.mjs.map
