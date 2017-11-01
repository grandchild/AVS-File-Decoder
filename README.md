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
yarn global add @visbot/webvsc || npm install --global @visbot/webvsc
```

## Usage

### CLI

Once setup, you can run `webvsc --help` to list available options. Alternatively, use `node build/cli.js`.

```
$ webvsc

  Usage: webvsc [options] <file(s)>

  Options:

    -V, --version    output the version number
    -v, --verbose    print more information, can be set multiple times to increase output
    -m, --minify     minify generated JSON
    -q, --quiet      print errors only
    -n, --no-hidden  don't extract hidden strings from fixed-size strings
    -h, --help       output usage information
```

Commonly, you would run `webvsc "avs/**/*.avs"` to convert a bunch of presets, or just one. When using wildcards, it's important to wrap the path in quotes.

### Troubleshooting

If you have literally thousands of presets you might run into _EMFILE_ errors. In that case use something like:

```sh
for dir in avs/*; do echo $dir; webvsc "$dir/**/*.avs" --silent; done
```

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
