# webvsc

[![License](https://img.shields.io/github/license/grandchild/AVS-File-Decoder?color=blue&style=for-the-badge)](https://github.com/grandchild/AVS-File-Decoder/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@visbot/webvsc?style=for-the-badge)](https://www.npmjs.org/package/@visbot/webvsc)
[![Build](https://img.shields.io/github/actions/workflow/status/grandchild/AVS-File-Decoder/default.yml?style=for-the-badge)](https://github.com/grandchild/AVS-File-Decoder/actions)

## Description

Library to to batch-convert [Winamp AVS presets](https://www.wikiwand.com/en/Advanced_Visualization_Studio) into native [Webvs](https://github.com/azeem/webvs) JSON format. Take a look at the [supported components](doc/components.md).

## Installation

Use your preferred [Node](https://nodejs.org) package manager to install the package:

```sh
npm install @visbot/webvsc@next
```

## Usage

`convertPreset(arrayBuffer, fileName, fileDate, [options])`

```js
import { convertPreset } from '@visbot/webvsc';
import fs from 'node:fs':

const avsBuffer = await fs.promises.readFile(file);
const presetName = 'My Awesome Preset'; // no file-extension!
const modifiedDate = (await fs.stat(file)).mtime || new Date();

const webvs = convertPreset(avsBuffer, presetName, modifiedDate.toISOString());
```

## Options

### hidden

Type: `boolean`  
Default: `false`  

Don't extract hidden strings from fixed-size strings

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
