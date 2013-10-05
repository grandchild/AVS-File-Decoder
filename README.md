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

Use the '[zip download](https://github.com/grandchild/AVS-File-Decoder/archive/master.zip)' option and extract its content

### Dependencies

By default, JQuery and Bootstrap are loaded from a CDN. Using [Bower](http://bower.io/), you can install the JQuery library locally - a fallback method is already implemented in the application. No Bootstrap fallback as of yet.

## Component Checklist:

 - [x] Effect List

### Misc
 - [x] AVS Trans
 - [x] Buffer Save
 - [x] Comment
 - [x] Framerate Limiter
 - [x] MIDI Trace
 - [x] Set Render Mode
 - [ ] ...

### Render
 - [x] Clear Screen
 - [x] Starfield
 - [x] Super Scope
 - [x] Texer II
 - [x] Triangle
 - [ ] ...

### Trans
 - [x] Blur
 - [x] Blitter Feedback
 - [x] Bump
 - [x] Channel Shift
 - [ ] Color Map
 - [x] Color Modifier
 - [x] Convolution Filter
 - [x] Dynamic Movement
 - [x] Fade Out
 - [x] Fast Brightness
 - [x] Grain
 - [x] Invert
 - [x] Mosaic
 - [x] Movement
 - [x] Normalize
 - [x] Video Delay
 - [x] Water
 - [x] Water Bump
 - [ ] ...


## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)