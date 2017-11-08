# webvsc

[![npm](https://img.shields.io/npm/l/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![npm](https://img.shields.io/npm/v/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![Travis CI](https://img.shields.io/travis/grandchild/AVS-File-Decoder/typescript.svg?style=flat-square)](https://travis-ci.org/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/dev/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder?type=dev)

## Description

Library to to batch-convert [Winamp AVS presets](https://www.wikiwand.com/en/Advanced_Visualization_Studio) into native [Webvs](https://github.com/azeem/webvs) JSON format. Take a look at the [supported components](doc/components.md).

[Live Demo](https://idleberg.github.io/webvsc-ui/)

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the package:

```sh
yarn add @visbot/webvsc || npm install  @visbot/webvsc
```

## Usage

```js
import { convertPreset } from '@visbot/webvsc';

let file = 'path/to/preset.avs';

readFile(file, (error, data) => {
    // Get preset's name and date
    let presetName = basename(file, extname(file));
    let presetDate = statSync(file).mtime.toISOString();

    // Convert
    let presetObj = convertPreset(data, presetName, presetDate);
    let presetJson = JSON.stringify(presetObj, null, 4);

    // Print result
    console.log(presetJson);
});
```

**Note:** The previously contained CLI tool has been detached and is now available as the separate [webvsc-cli](https://www.npmjs.com/package/@visbot/webvsc-cli) package!

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
