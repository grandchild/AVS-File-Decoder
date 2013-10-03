# AVS File Decoder

## Description

This little Javascript aims to read out the file format of Nullsoft's _Advanced Visualization Studio_ and rewrite it as JSON readable by [WebVS](https://github.com/azeem/webvs).

[Live Demo](http://decoder.visbot.net/)

The framework is mostly done now! And the remaining work is adding effects to the decoder.
If you want to help out - cool! Have a look at the top of [js/convert.js](https://github.com/grandchild/AVS-File-Decoder/blob/master/js/convert.js) there is a table with formattings for various effects. Just whip out a hex editor (I can recommend [wxHexEditor](http://www.wxhexeditor.org/)), open up a preset file, and add a new entry for a missing effect. Make sure you select "generic" as "func"tion value. And then push it this way. Thanks.

## Installation

* Clone the repository `git clone https://github.com/grandchild/AVS-File-Decoder.git`
* or use the '[zip download](https://github.com/grandchild/AVS-File-Decoder/archive/master.zip)' option.

By default, JQuery and Bootstrap are loaded from a CDN. Using [Bower](http://bower.io/), you can install the JQuery library locally - a fallback method is already implemented in the application.

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
 - [ ] Channel Shift
 - [x] AVS Trans
 - [x] Framerate Limiter
 - [x] Convolution Filter
 - [x] Texer II
 - [ ] Color Map
 - [ ] ...

## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)