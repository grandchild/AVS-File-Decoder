# webvsc

[![npm](https://img.shields.io/npm/l/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![npm](https://img.shields.io/npm/v/@visbot/webvsc.svg?style=flat-square)](https://www.npmjs.com/package/@visbot/webvsc)
[![Travis CI](https://img.shields.io/travis/grandchild/AVS-File-Decoder/typescript.svg?style=flat-square)](https://travis-ci.org/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder)
[![David](https://img.shields.io/david/dev/grandchild/AVS-File-Decoder.svg?style=flat-square)](https://david-dm.org/grandchild/AVS-File-Decoder?type=dev)

## Description

CLI tool to batch-convert [Winamp AVS presets](https://www.wikiwand.com/en/Advanced_Visualization_Studio) into native [Webvs](https://github.com/azeem/webvs) JSON format. Take a look at the [supported components](doc/components.md).

[Live Demo](http://grandchild.github.io/AVS-File-Decoder/) (uses an older version)

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the CLI globally

```sh
yarn add @visbot/webvsc || npm install  @visbot/webvsc
```

## Usage

```js
import { convertPreset } from '@visbot/webvsc/lib/convert';

readFile('path/to/preset.avs', (error, data) => {
    let presetObj = convertPreset(data, file, args);
    let presetJson = JSON.stringify(presetObj, null, 0);

    // Print result
    console.log(presetJson);
});
```

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
