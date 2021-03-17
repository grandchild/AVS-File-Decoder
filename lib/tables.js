"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blendmodeIn = [
    'IGNORE',
    'REPLACE',
    'FIFTY_FIFTY',
    'MAXIMUM',
    'ADDITIVE',
    'SUB_DEST_SRC',
    'SUB_SRC_DEST',
    'EVERY_OTHER_LINE',
    'EVERY_OTHER_PIXEL',
    'XOR',
    'ADJUSTABLE',
    'MULTIPLY',
    'BUFFER',
];
exports.blendmodeIn = blendmodeIn;
var blendmodeOut = [
    'REPLACE',
    'IGNORE',
    'MAXIMUM',
    'FIFTY_FIFTY',
    'SUB_DEST_SRC',
    'ADDITIVE',
    'EVERY_OTHER_LINE',
    'SUB_SRC_DEST',
    'XOR',
    'EVERY_OTHER_PIXEL',
    'MULTIPLY',
    'ADJUSTABLE',
    '_unassigned_',
    'BUFFER',
];
exports.blendmodeOut = blendmodeOut;
var blendmodeBuffer = [
    'REPLACE',
    'FIFTY_FIFTY',
    'ADDITIVE',
    'EVERY_OTHER_PIXEL',
    'SUB_DEST_SRC',
    'EVERY_OTHER_LINE',
    'XOR',
    'MAXIMUM',
    'MINIMUM',
    'SUB_SRC_DEST',
    'MULTIPLY',
    'ADJUSTABLE',
];
exports.blendmodeBuffer = blendmodeBuffer;
var blendmodeRender = [
    'REPLACE',
    'ADDITIVE',
    'MAXIMUM',
    'FIFTY_FIFTY',
    'SUB_DEST_SRC',
    'SUB_SRC_DEST',
    'MULTIPLY',
    'ADJUSTABLE',
    'XOR',
];
exports.blendmodeRender = blendmodeRender;
var blendmodePicture2 = [
    'REPLACE',
    'ADDITIVE',
    'MAXIMUM',
    'MINIMUM',
    'FIFTY_FIFTY',
    'SUB_DEST_SRC',
    'SUB_SRC_DEST',
    'MULTIPLY',
    'XOR',
    'ADJUSTABLE',
    'IGNORE',
];
exports.blendmodePicture2 = blendmodePicture2;
var blendmodeColorMap = [
    'REPLACE',
    'ADDITIVE',
    'MAXIMUM',
    'MINIMUM',
    'FIFTY_FIFTY',
    'SUB_DEST_SRC',
    'SUB_SRC_DEST',
    'MULTIPLY',
    'XOR',
    'ADJUSTABLE',
];
exports.blendmodeColorMap = blendmodeColorMap;
var blendmodeTexer = [
    'TEXTURE',
    'MASKED_TEXTURE'
];
exports.blendmodeTexer = blendmodeTexer;
var colorMapKey = [
    'RED',
    'GREEN',
    'BLUE',
    'CHANNEL_SUM_HALF',
    'MAX',
    'CHANNEL_AVERAGE',
];
exports.colorMapKey = colorMapKey;
var colorMapCycleMode = [
    'SINGLE',
    'ONBEAT_RANDOM',
    'ONBEAT_SEQUENTIAL',
];
exports.colorMapCycleMode = colorMapCycleMode;
var bufferMode = [
    'SAVE',
    'RESTORE',
    'ALTERNATE_SAVE_RESTORE',
    'ALTERNATE_RESTORE_SAVE',
];
exports.bufferMode = bufferMode;
var coordinates = [
    'POLAR',
    'CARTESIAN',
];
exports.coordinates = coordinates;
var drawMode = [
    'DOTS',
    'LINES',
];
exports.drawMode = drawMode;
var audioChannel = [
    'LEFT',
    'RIGHT',
    'CENTER',
];
exports.audioChannel = audioChannel;
var audioSource = [
    'WAVEFORM',
    'SPECTRUM',
];
exports.audioSource = audioSource;
var positionX = [
    'LEFT',
    'RIGHT',
    'CENTER',
];
exports.positionX = positionX;
var positionY = [
    'TOP',
    'BOTTOM',
    'CENTER',
];
exports.positionY = positionY;
var convolutionEdgeMode = [
    'EXTEND',
    'WRAP',
];
exports.convolutionEdgeMode = convolutionEdgeMode;
var multiFilterEffect = [
    'CHROME',
    'DOUBLE_CHROME',
    'TRIPLE_CHROME',
    'INFINITE_ROOT_MULTIPLIER_AND_SMALL_BORDER_CONVOLUTION',
];
exports.multiFilterEffect = multiFilterEffect;
var bufferBlendMode = [
    'REPLACE',
    'ADDITIVE',
    'MAXIMUM',
    'FIFTY_FIFTY',
    'SUB_DEST_SRC',
    'SUB_SRC_DEST',
    'MULTIPLY',
    'ADJUSTABLE',
    'XOR',
    'MINIMUM',
    'ABSOLUTE_DIFFERENCE',
];
exports.bufferBlendMode = bufferBlendMode;
var bufferBlendBuffer = [
    'buffer1',
    'buffer2',
    'buffer3',
    'buffer4',
    'buffer5',
    'buffer6',
    'buffer7',
    'buffer8',
    'CURRENT',
];
exports.bufferBlendBuffer = bufferBlendBuffer;
var particleSystemAccelerationType = [
    'CONSTANT',
    'FADE_OUT_BY_0_9',
    'FADE_OUT_BY_0_6',
    'COSINE',
    'SQUARED_COSINE',
];
exports.particleSystemAccelerationType = particleSystemAccelerationType;
var particleSystemColorBounce = [
    'STOP',
    'WRAP_EACH',
    'WAVE_EACH',
    'WRAP_ALL',
    'WAVE_ALL',
];
exports.particleSystemColorBounce = particleSystemColorBounce;
// pretty much directly from vis_avs/r_trans.cpp
// [name, script code representation (if any), 0:polar/1:cartesian]
var movementEffect = [
    ['None', '', 0],
    ['Slight Fuzzify', '', 0],
    ['Shift Rotate Left', 'x=x+1/32, // use wrap for this one', 1],
    ['Big Swirl Out', 'r = r + (0.1 - (0.2 * d)),\r\nd = d * 0.96,', 0],
    ['Medium Swirl', 'd = d * (0.99 * (1.0 - sin(r-$PI*0.5) / 32.0)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
    ['Sunburster', 'd = d * (0.94 + (cos((r-$PI*0.5) * 32.0) * 0.06)),', 0],
    ['Swirl To Center', 'd = d * (1.01 + (cos((r-$PI*0.5) * 4) * 0.04)),\r\nr = r + (0.03 * sin(d * $PI * 4)),', 0],
    ['Blocky Partial Out', '', 0],
    ['Swirling Around Both Ways At Once', 'r = r + (0.1 * sin(d * $PI * 5)),', 0],
    ['Bubbling Outward', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),', 0],
    ['Bubbling Outward With Swirl', 't = sin(d * $PI),\r\nd = d - (8*t*t*t*t*t)/sqrt((sw*sw+sh*sh)/4),\r\nt=cos(d*$PI/2.0),\r\nr= r + 0.1*t*t*t,', 0],
    ['5 Pointed Distro', 'd = d * (0.95 + (cos(((r-$PI*0.5) * 5.0) - ($PI / 2.50)) * 0.03)),', 0],
    ['Tunneling', 'r = r + 0.04,\r\nd = d * (0.96 + cos(d * $PI) * 0.05),', 0],
    ['Bleedin\'', 't = cos(d * $PI),\r\nr = r + (0.07 * t),\r\nd = d * (0.98 + t * 0.10),', 0],
    ['Shifted Big Swirl Out', 'd=sqrt(x*x+y*y), r=atan2(y,x),\r\nr=r+0.1-0.2*d, d=d*0.96,\r\nx=cos(r)*d + 8/128, y=sin(r)*d,', 1],
    ['Psychotic Beaming Outward', 'd = 0.15', 0],
    ['Cosine Radial 3-way', 'r = cos(r * 3)', 0],
    ['Spinny Tube', 'd = d * (1 - ((d - .35) * .5)),\r\nr = r + .1,', 0],
    ['Radial Swirlies', 'd = d * (1 - (sin((r-$PI*0.5) * 7) * .03)),\r\nr = r + (cos(d * 12) * .03),', 0],
    ['Swill', 'd = d * (1 - (sin((r - $PI*0.5) * 12) * .05)),\r\nr = r + (cos(d * 18) * .05),\r\nd = d * (1-((d - .4) * .03)),\r\nr = r + ((d - .4) * .13)', 0],
    ['Gridley', 'x = x + (cos(y * 18) * .02),\r\ny = y + (sin(x * 14) * .03),', 1],
    ['Grapevine', 'x = x + (cos(abs(y-.5) * 8) * .02),\r\ny = y + (sin(abs(x-.5) * 8) * .05),\r\nx = x * .95,\r\ny = y * .95,', 1],
    ['Quadrant', 'y = y * ( 1 + (sin(r + $PI/2) * .3) ),\r\nx = x * ( 1 + (cos(r + $PI/2) * .3) ),\r\nx = x * .995,\r\ny = y * .995,', 1],
    ['6-way Kaleida (use Wrap!)', 'y = (r*6)/($PI), x = d,', 1],
];
exports.movementEffect = movementEffect;
//# sourceMappingURL=tables.js.map