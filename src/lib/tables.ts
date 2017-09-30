const blendmodeIn = {
     '0': 'Ignore',
     '1': 'Replace',
     '2': '50/50',
     '3': 'Maximum',
     '4': 'Additive',
     '5': 'Dest-Src',
     '6': 'Src-Dest',
     '7': 'EveryOtherLine',
     '8': 'EveryOtherPixel',
     '9': 'XOR',
    '10': 'Adjustable',
    '11': 'Multiply',
    '12': 'Buffer',
};

const blendmodeOut = {
     '0': 'Replace',
     '1': 'Ignore',
     '2': 'Maximum',
     '3': '50/50',
     '4': 'Dest-Src',
     '5': 'Additive',
     '6': 'EveryOtherLine',
     '7': 'Src-Dest',
     '8': 'XOR',
     '9': 'EveryOtherPixel',
    '10': 'Multiply',
    '11': 'Adjustable',
    // don't ask me....
    '13': 'Buffer',
};

const blendmodeBuffer = {
     '0': 'Replace',
     '1': '50/50',
     '2': 'Additive',
     '3': 'EveryOtherPixel',
     '4': 'Dest-Src',
     '5': 'EveryOtherLine',
     '6': 'XOR',
     '7': 'Maximum',
     '8': 'Minimum',
     '9': 'Src-Dest',
    '10': 'Multiply',
    '11': 'Adjustable',
};

const blendmodeRender = {
    '0': 'Replace',
    '1': 'Additive',
    '2': 'Maximum',
    '3': '50/50',
    '4': 'Dest-Src',
    '5': 'Src-Dest',
    '6': 'Multiply',
    '7': 'Adjustable',
    '8': 'XOR',
};

const blendmodePicture2 = {
     '0': 'Replace',
     '1': 'Additive',
     '2': 'Maximum',
     '3': 'Minimum',
     '4': '50/50',
     '5': 'Dest-Src',
     '6': 'Src-Dest',
     '7': 'Multiply',
     '8': 'XOR',
     '9': 'Adjustable',
    '10': 'Ignore',
};

const blendmodeColorMap = {
    '0': 'Replace',
    '1': 'Additive',
    '2': 'Maximum',
    '3': 'Minimum',
    '4': '50/50',
    '5': 'Dest-Src',
    '6': 'Src-Dest',
    '7': 'Multiply',
    '8': 'XOR',
    '9': 'Adjustable',
};

const blendmodeTexer = {
    '0': 'Texture',
    '1': 'Masked Texture'
};

const colorMapKey = {
    '0': 'Red',
    '1': 'Green',
    '2': 'Blue',
    '3': '(R+G+B)/2',
    '4': 'MaxChannel',
    '5': '(R+G+B)/3',
};

const colorMapCycleMode = {
    '0': 'None (Map 1)',
    '1': 'OnBeat Random',
    '2': 'OnBeat Sequential',
};

const bufferMode = {
    '0': 'Save',
    '1': 'Restore',
    '2': 'AlternateSaveRestore',
    '3': 'AlternateRestoreSave',
};

const coordinates = {
    '0': 'Polar',
    '1': 'Cartesian',
};

const drawMode = {
    '0': 'Dots',
    '1': 'Lines',
};

const audioChannel = {
    '0': 'Left',
    '1': 'Right',
    '2': 'Center',
};

const audioSource = {
    '0': 'Waveform',
    '1': 'Spectrum',
};

const positionX = {
    '0': 'Left',
    '1': 'Right',
    '2': 'Center',
};

const positionY = {
    '0': 'Top',
    '1': 'Bottom',
    '2': 'Center',
};

const multiFilterEffect = {
    '0': 'Chrome',
    '1': 'Double Chrome',
    '2': 'Triple Chrome',
    '3': 'Infinite Root Multiplier + Small Border Convolution'
};

const bufferBlendMode = {
     '0': 'a=b (Replace)',
     '1': 'a=a+b (Additive)',
     '2': 'a=max(a,b) (Maximum)',
     '3': 'a=(a+b)/2 (50/50)',
     '4': 'a=a-b (Subtractive 1)',
     '5': 'a=b-a (Subtractive 2)',
     '6': 'a=a*b (Multiply)',
     '7': 'a=a*x+b*(1-x) (Adjustable)',
     '8': 'a=a xor b (XOR)',
     '9': 'a=min(a,b) (Minimum)',
    '10': 'a=|a-b| (Absolute difference)'
};

const bufferBlendBuffer = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 'Current'
};

const particleSystemAccelerationType = {
    '0': 'Constant',
    '1': 'Fade out by 0.9',
    '2': 'Fade out by 0.6',
    '3': 'Cosine',
    '4': 'Squared Cosine'
};

const particleSystemColorBounce = {
    '0': 'Stop',
    '1': 'Wrap each',
    '2': 'Wave each',
    '3': 'Wrap all',
    '4': 'Wave all'
};


// pretty much directly from vis_avs/r_trans.cpp
// [name, script code representation (if any), 0:polar/1:cartesian]
const movementEffect = {
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
    '14': ['Shifted Big Swirl Out', 'd=sqrt(x*x+y*y), r=atan2(y,x),\r\nr=r+0.1-0.2*d, d=d*0.96,\r\nx=cos(r)*d + 8/128, y=sin(r)*d,', 1], // comment from AVS src: // this is a very bad approximation in script. fix\r\n
    '15': ['Psychotic Beaming Outward', 'd = 0.15', 0],
    '16': ['Cosine Radial 3-way', 'r = cos(r * 3)', 0],
    '17': ['Spinny Tube', 'd = d * (1 - ((d - .35) * .5)),\r\nr = r + .1,', 0],
    '18': ['Radial Swirlies', 'd = d * (1 - (sin((r-$PI*0.5) * 7) * .03)),\r\nr = r + (cos(d * 12) * .03),', 0],
    '19': ['Swill', 'd = d * (1 - (sin((r - $PI*0.5) * 12) * .05)),\r\nr = r + (cos(d * 18) * .05),\r\nd = d * (1-((d - .4) * .03)),\r\nr = r + ((d - .4) * .13)', 0],
    '20': ['Gridley', 'x = x + (cos(y * 18) * .02),\r\ny = y + (sin(x * 14) * .03),', 1],
    '21': ['Grapevine', 'x = x + (cos(abs(y-.5) * 8) * .02),\r\ny = y + (sin(abs(x-.5) * 8) * .05),\r\nx = x * .95,\r\ny = y * .95,', 1],
    '22': ['Quadrant', 'y = y * ( 1 + (sin(r + $PI/2) * .3) ),\r\nx = x * ( 1 + (cos(r + $PI/2) * .3) ),\r\nx = x * .995,\r\ny = y * .995,', 1],
    '23': ['6-way Kaleida (use Wrap!)', 'y = (r*6)/($PI), x = d,', 1],
};

export {
    audioChannel,
    audioSource,
    blendmodeBuffer,
    blendmodeColorMap,
    blendmodeIn,
    blendmodeOut,
    blendmodePicture2,
    blendmodeRender,
    blendmodeTexer,
    bufferBlendMode,
    bufferBlendBuffer,
    bufferMode,
    colorMapKey,
    colorMapCycleMode,
    coordinates,
    drawMode,
    movementEffect,
    multiFilterEffect,
    particleSystemAccelerationType,
    particleSystemColorBounce,
    positionX,
    positionY
};
