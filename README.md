# webvsc

[![npm](https://flat.badgen.net/npm/license/@visbot/webvsc)](https://www.npmjs.org/package/@visbot/webvsc)
[![npm](https://flat.badgen.net/npm/v/@visbot/webvsc)](https://www.npmjs.org/package/@visbot/webvsc)
[![CI](https://img.shields.io/github/workflow/status/grandchild/AVS-File-Decoder/CI?style=flat-square)](https://github.com/grandchild/AVS-File-Decoder/actions)

## Description

Library to to batch-convert [Winamp AVS presets](https://www.wikiwand.com/en/Advanced_Visualization_Studio) into native [Webvs](https://github.com/azeem/webvs) JSON format. Take a look at the [supported components](doc/components.md).

[*Live Demo*](https://idleberg.github.io/webvsc-ui/)

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the package:

```sh
npm install @visbot/webvsc
```

## Usage

`convertPreset(arrayBuffer, fileName, fileDate, [options])`

```js
import { convertPreset } from '@visbot/webvsc';
import fs from 'node:fs':

const avsBuffer = await fs.promises.readFile(file);
const presetName = 'My Awesome Preset'; // no file-extension!
const modifiedDate = new Date().toISOString();

const webvs = convertPreset(avsBuffer, presetName, modifiedDate);
```

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
