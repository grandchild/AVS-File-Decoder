"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Constants
var sizeInt = 4;
/*
How component definition are written:

(Occasionally the word 'effect' is used instead of 'component'. This happens when the
perspective is more from within AVS itself, talking about the effect's particular
behaviors and properties. The term 'Component' is used more when talking about the
representation of an AVS effect in the context of this decoder/converter.)


Each component must specify at least these four basic keys:

- name:   A string with the effect name as shown in AVS

- code:   A number or (for APEs) a list of bytes, that uniquely identifies a
          component. The component code is the first data in an effect block in an .avs
          preset file.

- group:  A string describing the effect group the component belongs to. Typically one
          of 'Render', 'Trans' or 'Misc', but various APEs introduced their own. 'Effect
          List' is the only component with an empty group string and the only top-level
          effect in AVS.

- func:   The name of the parsing function used to decode this effect. Most commonly
          this is 'generic' for components with a static list of fields, but some
          effects have more complicated, conditional data layouts. These have dedicated
          functions.
          The value in 'func' is prepended with 'decode_' to form the function name in
          the decoder code. E.g.: The logic for 'generic' is defined in the
          'decode_generic()' function.


If the 'func' key is 'generic', then an additional key must be defined:

- fields: A list of ComponentField objects passed to decode_generic() to sequentially
          parse the fields for this effect. ComponentField objects have two keys:

          - k: The name of the field (or the special value '_SKIP', see below).

          - v: A ComponentFieldValue instance, which specifies the size and/or decoding
               and postprocessing function for the field. This is explained in detail
               below.


The ComponentFieldValue must take one the following shapes:

- a single string:  Parse the next bytes according to this utility function. The
                    function is defined in util.ts, prepended with 'get'. The number of
                    bytes consumed from the input is dependent on the function. E.g.:
                    Parsing a regular 32-bit/4-byte RGBA color value is done by using
                    'Color', which calls 'getColor()' which consumes the next 4 bytes
                    and adds the color value to the output.

- a single number:  Interpret the next n bytes of the input as an unsigned integer.
                    (Hint: If the value is signed, use the strings 'Int32' or 'Int64'
                    instead.)

- an array of types [string, number] or [string, number, string]:

- an array of [string, [number, number], string?]

- an array of [string, ComponentFieldValueMap];

*/
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
        'fields': [
            { 'k': 'rotationSpeed', 'v': 'Int32' },
            { 'k': 'colorTop', 'v': 'Color' },
            { 'k': 'colorHigh', 'v': 'Color' },
            { 'k': 'colorMid', 'v': 'Color' },
            { 'k': 'colorLow', 'v': 'Color' },
            { 'k': 'colorBottom', 'v': 'Color' },
            { 'k': 'angle', 'v': 'Int32' },
            { 'k': '_SKIP', 'v': sizeInt },
        ]
    },
    {
        'name': 'Oscilliscope Star',
        'code': 0x02,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'audioChannel', 'v': ['Bit', [2, 3], 'AudioChannel'] },
            { 'k': 'positionX', 'v': ['Bit', [4, 5], 'PositionX'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'colors', 'v': 'ColorList' },
            { 'k': 'size', 'v': sizeInt },
            { 'k': 'rotation', 'v': sizeInt },
        ]
    },
    {
        'name': 'FadeOut',
        'code': 0x03,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'speed', 'v': sizeInt },
            { 'k': 'color', 'v': 'Color' },
        ]
    },
    {
        'name': 'Blitter Feedback',
        'code': 0x04,
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'zoom', 'v': sizeInt },
            { 'k': 'onBeatZoom', 'v': sizeInt },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }] },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': 'bilinear', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'OnBeat Clear',
        'code': 0x05,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }] },
            { 'k': 'clearBeats', 'v': sizeInt },
        ]
    },
    {
        'name': 'Blur',
        'code': 0x06,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'blur', 'v': ['Map4', { 0: 'NONE', 1: 'MEDIUM', 2: 'LIGHT', 3: 'HEAVY' }] },
            { 'k': 'round', 'v': ['Map4', { 0: 'DOWN', 1: 'UP' }] },
        ]
    },
    {
        'name': 'Bass Spin',
        'code': 0x07,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabledLeft', 'v': ['Bit', 0, 'Boolified'] },
            { 'k': 'enabledRight', 'v': ['Bit', 1, 'Boolified'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'colorLeft', 'v': 'Color' },
            { 'k': 'colorRight', 'v': 'Color' },
            { 'k': 'mode', 'v': ['Map4', { 0: 'LINES', 1: 'TRIANGLES' }] },
        ]
    },
    {
        'name': 'Moving Particle',
        'code': 0x08,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bit', 0, 'Boolified'] },
            { 'k': 'onBeatSizeChange', 'v': ['Bit', 1, 'Boolified'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'distance', 'v': sizeInt },
            { 'k': 'particleSize', 'v': sizeInt },
            { 'k': 'onBeatParticleSize', 'v': sizeInt },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }] },
        ]
    },
    {
        'name': 'Roto Blitter',
        'code': 0x09,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'zoom', 'v': sizeInt },
            { 'k': 'rotate', 'v': sizeInt },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }] },
            { 'k': 'onBeatReverse', 'v': ['Bool', sizeInt] },
            { 'k': 'reversalSpeed', 'v': sizeInt },
            { 'k': 'onBeatZoom', 'v': sizeInt },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': 'bilinear', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'SVP',
        'code': 0x0A,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'library', 'v': ['SizeString', 260] },
        ]
    },
    {
        'name': 'Colorfade',
        'code': 0x0B,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bit', 0, 'Boolified'] },
            { 'k': 'onBeat', 'v': ['Bit', 2, 'Boolified'] },
            { 'k': 'onBeatRandom', 'v': ['Bit', 1, 'Boolified'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'fader1', 'v': 'Int32' },
            { 'k': 'fader2', 'v': 'Int32' },
            { 'k': 'fader3', 'v': 'Int32' },
            { 'k': 'beatFader1', 'v': 'Int32' },
            { 'k': 'beatFader2', 'v': 'Int32' },
            { 'k': 'beatFader3', 'v': 'Int32' },
        ]
    },
    {
        'name': 'Color Clip',
        'code': 0x0C,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'mode', 'v': ['Map4', { 0: 'OFF', 1: 'BELOW', 2: 'ABOVE', 3: 'NEAR' }] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'outColor', 'v': 'Color' },
            { 'k': 'level', 'v': sizeInt },
        ]
    },
    {
        'name': 'Rotating Stars',
        'code': 0x0D,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'colors', 'v': 'ColorList' },
        ]
    },
    {
        'name': 'Ring',
        'code': 0x0E,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'audioChannel', 'v': ['Bit', [2, 3], 'AudioChannel'] },
            { 'k': 'positionX', 'v': ['Bit', [4, 5], 'PositionX'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'colors', 'v': 'ColorList' },
            { 'k': 'size', 'v': sizeInt },
            { 'k': 'audioSource', 'v': ['UInt32', sizeInt, 'AudioSource'] },
        ]
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
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Dot Grid',
        'code': 0x11,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'colors', 'v': 'ColorList' },
            { 'k': 'spacing', 'v': sizeInt },
            { 'k': 'speedX', 'v': 'Int32' },
            { 'k': 'speedY', 'v': 'Int32' },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }] },
        ]
    },
    {
        'name': 'Buffer Save',
        'code': 0x12,
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'action', 'v': ['BufferMode', sizeInt] },
            { 'k': 'bufferId', 'v': ['Map4', { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8 }] },
            { 'k': 'blendMode', 'v': ['BlendmodeBuffer', sizeInt] },
            { 'k': 'adjustBlend', 'v': sizeInt },
        ]
    },
    {
        'name': 'Dot Fountain',
        'code': 0x13,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'rotationSpeed', 'v': 'Int32' },
            { 'k': 'colorTop', 'v': 'Color' },
            { 'k': 'colorHigh', 'v': 'Color' },
            { 'k': 'colorMid', 'v': 'Color' },
            { 'k': 'colorLow', 'v': 'Color' },
            { 'k': 'colorBottom', 'v': 'Color' },
            { 'k': 'angle', 'v': 'Int32' },
            { 'k': '_SKIP', 'v': sizeInt },
        ]
    },
    {
        'name': 'Water',
        'code': 0x14,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Comment',
        'code': 0x15,
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'text', 'v': 'SizeString' },
        ]
    },
    {
        'name': 'Brightness',
        'code': 0x16,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'red', 'v': 'Int32' },
            { 'k': 'green', 'v': 'Int32' },
            { 'k': 'blue', 'v': 'Int32' },
            { 'k': 'separate', 'v': ['Bool', sizeInt] },
            { 'k': 'excludeColor', 'v': 'Color' },
            { 'k': 'exclude', 'v': ['Bool', sizeInt] },
            { 'k': 'distance', 'v': sizeInt },
        ]
    },
    {
        'name': 'Interleave',
        'code': 0x17,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'x', 'v': sizeInt },
            { 'k': 'y', 'v': sizeInt },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'onbeat', 'v': ['Bool', sizeInt] },
            { 'k': 'x2', 'v': sizeInt },
            { 'k': 'y2', 'v': sizeInt },
            { 'k': 'beatDuration', 'v': sizeInt },
        ]
    },
    {
        'name': 'Grain',
        'code': 0x18,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'amount', 'v': sizeInt },
            { 'k': 'static', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Clear Screen',
        'code': 0x19,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }] },
            { 'k': 'onlyFirst', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Mirror',
        'code': 0x1A,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'topToBottom', 'v': ['Bit', 0, 'Boolified'] },
            { 'k': 'bottomToTop', 'v': ['Bit', 1, 'Boolified'] },
            { 'k': 'leftToRight', 'v': ['Bit', 2, 'Boolified'] },
            { 'k': 'rightToLeft', 'v': ['Bit', 3, 'Boolified'] },
            { 'k': '_SKIP', 'v': sizeInt - 1 },
            { 'k': 'onBeatRandom', 'v': ['Bool', sizeInt] },
            { 'k': 'smoothTransition', 'v': ['Bool', sizeInt] },
            { 'k': 'transitionDuration', 'v': sizeInt },
        ]
    },
    {
        'name': 'Starfield',
        'code': 0x1B,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': sizeInt },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'WarpSpeed', 'v': 'Float' },
            { 'k': 'MaxStars_set', 'v': sizeInt },
            { 'k': 'onbeat', 'v': sizeInt },
            { 'k': 'spdBeat', 'v': 'Float' },
            { 'k': 'durFrames', 'v': sizeInt },
        ]
    },
    {
        'name': 'Text',
        'code': 0x1C,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': 'insertBlanks', 'v': ['Bool', sizeInt] },
            { 'k': 'randomPosition', 'v': ['Bool', sizeInt] },
            { 'k': 'verticalAlign', 'v': ['Map4', { 0: 'TOP', 4: 'CENTER', 8: 'BOTTOM', }] },
            { 'k': 'horizontalAlign', 'v': ['Map4', { 0: 'LEFT', 1: 'CENTER', 2: 'RIGHT', }] },
            { 'k': 'onBeatSpeed', 'v': sizeInt },
            { 'k': 'normSpeed', 'v': sizeInt },
            { 'k': '_SKIP', 'v': 60 },
            // Win LOGFONT structure, 60bytes, this is more interesting:
            { 'k': '_SKIP', 'v': sizeInt * 4 },
            // LONG  lfWidth;
            // LONG  lfEscapement;
            // LONG  lfOrientation;
            // LONG  lfWeight;
            { 'k': 'weight', 'v': ['Map4', { 0: 'DONTCARE', 100: 'THIN', 200: 'EXTRALIGHT', 300: 'LIGHT', 400: 'REGULAR', 500: 'MEDIUM', 600: 'SEMIBOLD', 700: 'BOLD', 800: 'EXTRABOLD', 900: 'BLACK' }] },
            { 'k': 'italic', 'v': ['Bool', 1] },
            { 'k': 'underline', 'v': ['Bool', 1] },
            { 'k': 'strikeOut', 'v': ['Bool', 1] },
            { 'k': 'charSet', 'v': 1 },
            { 'k': '_SKIP', 'v': 4 },
            // BYTE  lfClipPrecision;
            // BYTE  lfQuality;
            // BYTE  lfPitchAndFamily;
            { 'k': 'fontName', 'v': ['SizeString', 32] },
            { 'k': 'text', 'v': ['SizeString', 0 /*=> variable length*/, 'SemiColSplit'] },
            { 'k': 'outline', 'v': ['Bool', sizeInt] },
            { 'k': 'outlineColor', 'v': 'Color' },
            { 'k': 'shiftX', 'v': sizeInt },
            { 'k': 'shiftY', 'v': sizeInt },
            { 'k': 'outlineShadowSize', 'v': sizeInt },
            { 'k': 'randomWord', 'v': ['Bool', sizeInt] },
            { 'k': 'shadow', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Bump',
        'code': 0x1D,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': 'duration', 'v': sizeInt },
            { 'k': 'depth', 'v': sizeInt },
            { 'k': 'onBeatDepth', 'v': sizeInt },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'code', 'v': 'CodeFBI' },
            { 'k': 'showDot', 'v': ['Bool', sizeInt] },
            { 'k': 'invertDepth', 'v': ['Bool', sizeInt] },
            { 'k': '_SKIP', 'v': sizeInt },
            { 'k': 'depthBuffer', 'v': 'BufferNum' },
        ]
    },
    {
        'name': 'Mosaic',
        'code': 0x1E,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'squareSize', 'v': sizeInt },
            { 'k': 'onBeatSquareSize', 'v': sizeInt },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'onBeatSizeChange', 'v': ['Bool', sizeInt] },
            { 'k': 'onBeatSizeDuration', 'v': sizeInt },
        ]
    },
    {
        'name': 'Water Bump',
        'code': 0x1F,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'density', 'v': sizeInt },
            { 'k': 'depth', 'v': sizeInt },
            { 'k': 'random', 'v': ['Bool', sizeInt] },
            { 'k': 'dropPositionX', 'v': sizeInt },
            { 'k': 'dropPositionY', 'v': sizeInt },
            { 'k': 'dropRadius', 'v': sizeInt },
            { 'k': 'method', 'v': sizeInt },
        ]
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
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'mode', 'v': ['RadioButton', { 0: 'ARBITRARY', 1: 'SKIP', 2: 'REVERSE' }] },
            { 'k': 'arbitraryValue', 'v': sizeInt },
            { 'k': 'skipValue', 'v': sizeInt },
            { 'k': 'skipFirstBeats', 'v': sizeInt },
        ]
    },
    {
        'name': 'Picture',
        'code': 0x22,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'adapt', 'v': sizeInt },
            { 'k': 'onBeatPersist', 'v': sizeInt },
            { 'k': 'file', 'v': 'NtString' },
            { 'k': 'ratio', 'v': sizeInt },
            { 'k': 'aspectRatioAxis', 'v': ['Map4', { 0: 'X', 1: 'Y' }] },
        ]
    },
    {
        'name': 'Dynamic Distance Modifier',
        'code': 0x23,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': [
            { 'k': 'new_version', 'v': ['Bool', 1] },
            { 'k': 'code', 'v': 'CodePFBI' },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }] },
            { 'k': 'bilinear', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Super Scope',
        'code': 0x24,
        'group': 'Render',
        'func': 'versioned_generic',
        'fields': [
            { 'k': 'new_version', 'v': ['Bool', 1] },
            { 'k': 'code', 'v': 'CodePFBI' },
            { 'k': 'audioChannel', 'v': ['Bit', [0, 1], 'AudioChannel'] },
            { 'k': 'audioSource', 'v': ['Bit', 2, 'AudioSource'] },
            { 'k': '_SKIP', 'v': 3 },
            { 'k': 'colors', 'v': 'ColorList' },
            { 'k': 'drawMode', 'v': ['DrawMode', sizeInt] },
        ]
    },
    {
        'name': 'Invert',
        'code': 0x25,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Unique Tone',
        'code': 0x26,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'invert', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Timescope',
        'code': 0x27,
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }] },
            { 'k': 'audioChannel', 'v': ['UInt32', sizeInt, 'AudioChannel'] },
            { 'k': 'bands', 'v': sizeInt },
        ]
    },
    {
        'name': 'Set Render Mode',
        'code': 0x28,
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'blend', 'v': ['BlendmodeRender', 1] },
            { 'k': 'adjustBlend', 'v': 1 },
            { 'k': 'lineSize', 'v': 1 },
            { 'k': 'enabled', 'v': ['Bit', 7, 'Boolified'] },
        ]
    },
    {
        'name': 'Interferences',
        'code': 0x29,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'numberOfLayers', 'v': sizeInt },
            { 'k': '_SKIP', 'v': sizeInt },
            { 'k': 'distance', 'v': sizeInt },
            { 'k': 'alpha', 'v': sizeInt },
            { 'k': 'rotation', 'v': 'Int32' },
            { 'k': 'blendMode', 'v': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }] },
            { 'k': 'onBeatDistance', 'v': sizeInt },
            { 'k': 'onBeatAlpha', 'v': sizeInt },
            { 'k': 'onBeatRotation', 'v': sizeInt },
            { 'k': 'separateRGB', 'v': ['Bool', sizeInt] },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': 'speed', 'v': 'Float' },
        ]
    },
    {
        'name': 'Dynamic Shift',
        'code': 0x2A,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': [
            { 'k': 'new_version', 'v': ['Bool', 1] },
            { 'k': 'code', 'v': 'CodeIFB' },
            { 'k': 'blendMode', 'v': ['Map4', { 0: 'Replace', 1: 'FIFTY_FIFTY' }] },
            { 'k': 'bilinear', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Dynamic Movement',
        'code': 0x2B,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': [
            { 'k': 'new_version', 'v': ['Bool', 1] },
            { 'k': 'code', 'v': 'CodePFBI' },
            { 'k': 'bFilter', 'v': ['Bool', sizeInt] },
            { 'k': 'coord', 'v': ['Coordinates', sizeInt] },
            { 'k': 'gridW', 'v': sizeInt },
            { 'k': 'gridH', 'v': sizeInt },
            { 'k': 'blend', 'v': ['Bool', sizeInt] },
            { 'k': 'wrap', 'v': ['Bool', sizeInt] },
            { 'k': 'buffer', 'v': 'BufferNum' },
            { 'k': 'alphaOnly', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Fast Brightness',
        'code': 0x2C,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'factor', 'v': ['Map4', { 0: 2, 1: 0.5, 2: 1 }] },
        ]
    },
    {
        'name': 'Color Modifier',
        'code': 0x2D,
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'recomputeEveryFrame', 'v': ['Bool', 1] },
            { 'k': 'code', 'v': 'CodePFBI' },
        ]
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
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'logging', 'v': ['Bool', sizeInt] },
            { 'k': 'translateFirstLevel', 'v': ['Bool', sizeInt] },
            { 'k': 'readCommentCodes', 'v': ['Bool', sizeInt] },
            { 'k': 'code', 'v': 'NtString' },
        ]
    },
    {
        'name': 'Texer',
        'code': // Texer...........................
        [0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': '_SKIP', 'v': sizeInt * 4 },
            { 'k': 'image', 'v': ['SizeString', 260] },
            { 'k': 'input', 'v': ['Bit', 0, 'BlendmodeIn'] },
            { 'k': 'blendMode', 'v': ['Bit', 2, 'BlendmodeTexer'] },
            { 'k': '_SKIP', 'v': 3 },
            { 'k': 'particles', 'v': sizeInt },
            { 'k': '_SKIP', 'v': 4 },
        ]
    },
    {
        'name': 'Texer II',
        'code': // Acko.net: Texer II..............
        [0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': '_SKIP', 'v': sizeInt },
            { 'k': 'imageSrc', 'v': ['SizeString', 260] },
            { 'k': 'resizing', 'v': ['Bool', sizeInt] },
            { 'k': 'wrapAround', 'v': ['Bool', sizeInt] },
            { 'k': 'colorFiltering', 'v': ['Bool', sizeInt] },
            { 'k': '_SKIP', 'v': sizeInt },
            { 'k': 'code', 'v': 'CodeIFBP' },
        ]
    },
    {
        'name': 'Color Map',
        'code': // Color Map.......................
        [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'key', 'v': ['ColorMapKey', sizeInt] },
            { 'k': 'blendMode', 'v': ['BlendmodeColorMap', sizeInt] },
            { 'k': 'mapCycleMode', 'v': ['ColorMapCycleMode', sizeInt] },
            { 'k': 'adjustBlend', 'v': 1 },
            { 'k': '_SKIP', 'v': 1 },
            { 'k': 'dontSkipFastBeats', 'v': ['Bool', 1] },
            { 'k': 'cycleSpeed', 'v': 1 },
            { 'k': 'maps', 'v': 'ColorMaps' },
        ]
    },
    {
        'name': 'Framerate Limiter',
        'code': // VFX FRAMERATE LIMITER...........
        [0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'limit', 'v': sizeInt },
        ]
    },
    {
        'name': 'Convolution Filter',
        'code': // Holden03: Convolution Filter....
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'edgeMode', 'v': ['ConvolutionEdgeMode', sizeInt] },
            { 'k': 'absolute', 'v': ['Bool', sizeInt] },
            { 'k': 'twoPass', 'v': ['Bool', sizeInt] },
            { 'k': 'kernel', 'v': ['ConvoFilter', [7, 7]] },
            { 'k': 'bias', 'v': 'Int32' },
            { 'k': 'scale', 'v': 'Int32' },
        ]
    },
    {
        'name': 'Triangle',
        'code': // Render: Triangle................
        [0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20, 0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'code', 'v': 'NtCodeIFBP' },
        ]
    },
    {
        'name': 'Channel Shift',
        'code': // Channel Shift...................
        [0x43, 0x68, 0x61, 0x6E, 0x6E, 0x65, 0x6C, 0x20, 0x53, 0x68, 0x69, 0x66, 0x74, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            // some keys seeem to have changed between versions.
            { 'k': 'mode', 'v': ['Map4', { 0: 'RGB', 1023: 'RGB', 1144: 'RGB', 1020: 'RBG', 1019: 'BRG', 1021: 'BGR', 1018: 'GBR', 1022: 'GRB', 1183: 'RGB' /*1183 (probably from an old APE version?) presents as if nothing is selected, so set to RGB*/ }] },
            { 'k': 'onBeatRandom', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Normalize',
        'code': // Trans: Normalise................
        [0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E, 0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Video Delay',
        'code': // Holden04: Video Delay...........
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34, 0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'useBeats', 'v': ['Bool', sizeInt] },
            { 'k': 'delay', 'v': sizeInt },
        ]
    },
    {
        'name': 'Multiplier',
        'code': // Multiplier......................
        [0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'multiply', 'v': ['Map4', { 0: 'INFINITE_ROOT', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'INFINITE_SQUARE' }] },
        ]
    },
    {
        'name': 'Color Reduction',
        'code': // Color Reduction.................
        [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x52, 0x65, 0x64, 0x75, 0x63, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': '_SKIP', 'v': 260 },
            { 'k': 'colors', 'v': ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }] },
        ]
    },
    {
        'name': 'Multi Delay',
        'code': // Holden05: Multi Delay...........
        [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x35, 0x3A, 0x20, 0x4D, 0x75, 0x6C, 0x74, 0x69, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'mode', 'v': ['Map4', { 0: 'DISABLED', 1: 'INPUT', 2: 'OUTPUT' }] },
            { 'k': 'activeBuffer', 'v': sizeInt },
            { 'k': 'useBeats0', 'v': ['Bool', sizeInt] },
            { 'k': 'delay0', 'v': sizeInt },
            { 'k': 'useBeats1', 'v': ['Bool', sizeInt] },
            { 'k': 'delay1', 'v': sizeInt },
            { 'k': 'useBeats2', 'v': ['Bool', sizeInt] },
            { 'k': 'delay2', 'v': sizeInt },
            { 'k': 'useBeats3', 'v': ['Bool', sizeInt] },
            { 'k': 'delay3', 'v': sizeInt },
            { 'k': 'useBeats4', 'v': ['Bool', sizeInt] },
            { 'k': 'delay4', 'v': sizeInt },
            { 'k': 'useBeats5', 'v': ['Bool', sizeInt] },
            { 'k': 'delay5', 'v': sizeInt },
        ]
    },
    {
        'name': 'Buffer Blend',
        'code': // Misc: Buffer blend..............
        [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65, 0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'bufferB', 'v': ['BufferBlendBuffer', sizeInt] },
            { 'k': 'bufferA', 'v': ['BufferBlendBuffer', sizeInt] },
            { 'k': 'mode', 'v': ['BufferBlendMode', sizeInt] },
        ]
    },
    {
        'name': 'MIDI Trace',
        'code': // Nullsoft Pixelcorps: MIDItrace .
        [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F, 0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44, 0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'channel', 'v': sizeInt },
            { 'k': 'mode', 'v': ['Map4', { 1: 'CURRENT', 2: 'TRIGGER' }] },
            { 'k': 'allChannels', 'v': ['Bool', sizeInt] },
            { 'k': 'printEvents', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Add Borders',
        'code': // Virtual Effect: Addborders......
        [0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20, 0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65, 0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'size', 'v': sizeInt },
        ]
    },
    {
        'name': 'AVI Player',
        'code': // VFX AVI PLAYER..................
        [0x56, 0x46, 0x58, 0x20, 0x41, 0x56, 0x49, 0x20, 0x50, 0x4C, 0x41, 0x59, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'filePath', 'v': ['SizeString', 256] },
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'FyrewurX',
        'code': // FunkyFX FyrewurX v1.............
        [0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20, 0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58, 0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Global Variables',
        'code': // Jheriko: Global.................
        [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x3A, 0x20, 0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': 'load', 'v': ['Map4', { 0: 'NONE', 1: 'ONCE', 2: 'CODE_CONTROL', 3: 'EVERY_FRAME' }] },
            { 'k': '_SKIP', 'v': sizeInt * 6 },
            { 'k': 'code', 'v': 'NtCodeIFB' },
            { 'k': 'file', 'v': 'NtString' },
            { 'k': 'saveRegRange', 'v': 'NtString' },
            { 'k': 'saveBufRange', 'v': 'NtString' },
        ]
    },
    {
        'name': 'Fluid',
        'code': // GeissFluid......................
        [0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75, 0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': [
            { 'k': '_SKIP', 'v': sizeInt },
        ]
    },
    {
        'name': 'Picture II',
        'code': // Picture II......................
        [0x50, 0x69, 0x63, 0x74, 0x75, 0x72, 0x65, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'image', 'v': ['NtString', 260] },
            { 'k': 'blendMode', 'v': ['BlendmodePicture2', sizeInt] },
            { 'k': 'onBeatOutput', 'v': ['BlendmodePicture2', sizeInt] },
            { 'k': 'bilinear', 'v': ['Bool', sizeInt] },
            { 'k': 'onBeatBilinear', 'v': ['Bool', sizeInt] },
            { 'k': 'adjustBlend', 'v': sizeInt },
            { 'k': 'onBeatAdjustBlend', 'v': sizeInt },
        ]
    },
    {
        'name': 'MultiFilter',
        'code': // Jheriko : MULTIFILTER...........
        [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20, 0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46, 0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', sizeInt] },
            { 'k': 'effect', 'v': ['MultiFilterEffect', sizeInt] },
            { 'k': 'onBeat', 'v': ['Bool', sizeInt] },
            { 'k': '_SKIP', 'v': ['Bool', sizeInt] },
        ]
    },
    {
        'name': 'Particle System',
        'code': // ParticleSystem..................
        [0x50, 0x61, 0x72, 0x74, 0x69, 0x63, 0x6C, 0x65, 0x53, 0x79, 0x73, 0x74, 0x65, 0x6D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': [
            { 'k': 'enabled', 'v': ['Bool', 1] },
            { 'k': 'bigParticles', 'v': ['Bool', 1] },
            { 'k': '_SKIP', 'v': 2 },
            { 'k': 'particles', 'v': sizeInt },
            { 'k': 'particles+/-', 'v': sizeInt },
            { 'k': 'lifetime', 'v': sizeInt },
            { 'k': 'lifetime+/-', 'v': sizeInt },
            { 'k': '_SKIP', 'v': 32 },
            { 'k': 'spread', 'v': 'Float' },
            { 'k': 'initialSpeed', 'v': 'Float' },
            { 'k': 'initialSpeed+/-', 'v': 'Float' },
            { 'k': 'acceleration', 'v': 'Float' },
            { 'k': 'accelerationType', 'v': ['ParticleSystemAccelerationType', sizeInt] },
            { 'k': 'color', 'v': 'Color' },
            { 'k': 'color+/-', 'v': 'Color' },
            { 'k': 'colorChange3', 'v': 1 },
            { 'k': 'colorChange2', 'v': 1 },
            { 'k': 'colorChange1', 'v': 1 },
            { 'k': '_SKIP', 'v': 1 },
            { 'k': 'colorChange+/-', 'v': 1 },
            { 'k': 'colorChange+/-', 'v': 1 },
            { 'k': 'colorChange+/-', 'v': 1 },
            { 'k': '_SKIP', 'v': 1 },
            { 'k': 'colorBounce', 'v': ['ParticleSystemColorBounce', sizeInt] },
        ]
    }
    /*
    {
        'name': '',
        'code': //
            [],
        'group': '',
        'func': 'generic',
        'fields': [

        }
    },
    */
];
exports.dll = dll;
//# sourceMappingURL=components.js.map