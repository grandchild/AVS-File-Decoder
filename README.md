# webvsc

[![npm](https://img.shields.io/npm/l/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![npm](https://img.shields.io/npm/v/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![CircleCI](https://img.shields.io/circleci/project/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://circleci.com/gh/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/dev/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder?type=dev)

## Description

Library to to batch-convert [Winamp AVS presets](https://www.wikiwand.com/en/Advanced_Visualization_Studio) into native [Webvs](https://github.com/azeem/webvs) JSON format. Take a look at the [supported components](doc/components.md).

[*Live Demo*](https://idleberg.github.io/webvsc-ui/)

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the package:

```sh
yarn add @visbot/webvsc || npm install  @visbot/webvsc
```

## Usage

`convertFile(file, [options])`

**Example:**

```js
import { convertFile, convertFileSync } from '@visbot/webvsc';

let file = 'path/to/preset.avs';
let jsonString;

// Asynchronous
(async () => {
    try {
        jsonString = await convertFile(file);
    } catch (err) {
        console.error(err);
    }
})();

// Synchronous
try {
    jsonString = convertFileSync(file);
} catch (err) {
    console.error(err);
}
```

**Note:** The previously contained CLI tool has been detached and is now available as the separate [webvsc-cli](https://www.npmjs.com/package/@visbot/webvsc-cli) package!

## Options

### hidden

Type: `boolean`  
Default: `false`  

Don't extract hidden strings from fixed-size strings

### minify

Type: `boolean`  
Default: `false`  

Minify generated JSON

### quiet

Type: `boolean`  
Default: `false`  

Prints errors only

### verbose

Type: `number`  
Default: `0`  

Control the amount of output displayed:

* `0` Display name of operation (read/write)
* `1` List detected components
* `2` List component details

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
