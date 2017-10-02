# AVS File Decoder

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Travis CI](https://img.shields.io/travis/grandchild/AVS-File-Decoder/typescript.svg?style=flat-square)](https://travis-ci.org/grandchild/AVS-File-Decoder)

## Description

This little Javascript reads out the file format of Nullsoft's _Advanced Visualization Studio_ and rewrites it as JSON readable by [Webvs](https://github.com/azeem/webvs).

[Live Demo](http://grandchild.github.io/AVS-File-Decoder/) (older version)

## Installation

### GitHub

Clone the repository `git clone https://github.com/grandchild/AVS-File-Decoder.git`

### Download

Use the '[zip download](https://github.com/grandchild/AVS-File-Decoder/archive/typescript.zip)' option and extract its content

### Prerequisites

Make sure you already have [Node](https://nodejs.org) installed and in your [PATH environmental variable](https://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them/284351#284351). Using [Yarn](https://yarnpkg.com/) is recommended over `npm`, but entirely optional.

```sh
$ cd AVS-File-Decoder

# Install Dependencies
$ yarn || npm install

# Build
$ yarn build || npm run build

# Sym-link webvsc.js
$ yarn link || npm link
```

### CLI

Once setup, you can run `webvsc --help` to list available options. Alternatively, use `node build/cli.js`.

```sh
$ webvsc

  Usage: webvsc [options] <file(s)>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -d, --debug    prints in-depth information
    -m, --minify   minify generated JSON
    -s, --silent   prints errors only
```

Commonly, you would run `webvsc "avs/**/*.avs"` to convert a bunch of presets, or just one.

If you have literally thousands of presets you might run into _EMFILE_ errors. In that case use something like:

`for dir in avs/*; do echo $dir; webvsc $dir/**/*.avs --silent; done`

## Component Checklist:

- `Effect List`

### Misc
- `AVS Trans Automation`
- `Buffer Blend`
- `Buffer Save`
- `Comment`
- `Custom BPM`
- `Framerate Limiter`
- `Global Variables`
- `MIDI Trace`
- `Set Render Mode`

### Trans
- `Blitter Feedback`
- `Blur`
- `Brightness`
- `Bump`
- `Channel Shift`
- `Color Clip`
- `Color Map`
- `Color Modifier`
- `Color Reduction`
- `Colorfade`
- `Convolution Filter`
- `Dynamic Distance Modifier`
- `Dynamic Movement`
- `Dynamic Shift`
- `FadeOut`
- `Fast Brightness`
- `Grain`
- `Interferences`
- `Interleave`
- `Invert`
- `Mirror`
- `Mosaic`
- `Movement`
- `Multi Delay`
- `Multi Filter`
- `Multiplier`
- `Normalize`
- `Roto Blitter`
- `Scatter`
- `Unique Tone`
- `Video Delay`
- `Water Bump`
- `Water`

### Render
- `AVI`
- `Bass Spin`
- `Clear Screen`
- `Dot Fountain`
- `Dot Grid`
- `Dot Plane`
- `Fluid`
- `FyrewurX`
- `Moving Particle`
- `OnBeat Clear`
- `Oscilliscope Star`
- `Particle System`
- `Picture`
- `Picture II`
- `Ring`
- `Rotating Stars`
- `Simple`
- `Starfield`
- `Super Scope`
- `SVP`
- `Texer`
- `Texer II`
- `Text`
- `Timescope`
- `Triangle`


## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
