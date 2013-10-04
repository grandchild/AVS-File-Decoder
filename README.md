# AVS File Decoder

## Description

This little Javascript aims to read out the file format of Nullsoft's _Advanced Visualization Studio_ and rewrite it as JSON readable by [WebVS](https://github.com/azeem/webvs).

[Live Demo](http://decoder.visbot.net/)

The framework is mostly done now! And the remaining work is adding effects to the decoder.
If you want to help out - cool! Have a look at the top of [js/convert.js](https://github.com/grandchild/AVS-File-Decoder/blob/master/js/convert.js) there is a table with formattings for various effects. Just whip out a hex editor (I can recommend [wxHexEditor](http://www.wxhexeditor.org/)), open up a preset file, and add a new entry for a missing effect. Make sure you select "generic" as "func"tion value. And then push it this way. Thanks.

## Installation

### GitHub

Clone the repository `git clone https://github.com/grandchild/AVS-File-Decoder.git`

### Download

Use the `[.zip](https://github.com/grandchild/AVS-File-Decoder/archive/master.zip) download option and extract its content

### Dependencies

By default, JQuery and Bootstrap are loaded from a CDN. Using [Bower](http://bower.io/), you can install the JQuery library locally - a fallback method is already implemented into the application.

`bower install`

Unfortunately, there's no Bootstrap fallback as of yet.

## Building

In order to compile minified javascript, download the [YUI Compressor](https://github.com/yui/yuicompressor/releases) and move the binary to `bin/yuicompressor.jar` in your repository. Minify the javascript using the build command `/.build` (`build.bat` on Windows).

## Component Checklist:

 - [x] Effect List
 - [x] Set Render Mode
 - [x] Buffer Save
 - [x] Comment
 - [x] Super Scope
 - [x] Dynamic Movement
 - [ ] Movement
 - [x] Color Modifier
 - [x] Fade Out
 - [x] Channel Shift
 - [x] Blitter Feedback
 - [x] Blur
 - [x] Water
 - [x] Grain
 - [x] Fast Brightness
 - [x] Invert
 - [x] Bump
 - [x] AVS Trans
 - [x] Triangle
 - [x] Framerate Limiter
 - [x] Convolution Filter
 - [x] Texer II
 - [x] Normalize
 - [ ] Color Map
 - [x] MIDI Trace
 - [ ] ...

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)