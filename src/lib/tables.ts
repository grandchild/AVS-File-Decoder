export default {
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
        '13': ["Bleedin'", 't = cos(d * $PI),\r\nr = r + (0.07 * t),\r\nd = d * (0.98 + t * 0.10),', 0],
        '14': ['Shifted Big Swirl Out', 'd=sqrt(x*x+y*y), r=atan2(y,x),\r\nr=r+0.1-0.2*d, d=d*0.96,\r\nx=cos(r)*d + 8/128, y=sin(r)*d,', 1], // comment from AVS src: // this is a very bad approximation in script. fix\r\n
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
