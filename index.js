#!/usr/bin/env node

const join = require('path').join;

/*  The TypeScript compiler does not support she-bangs,
 *  so we need this stupid workaround 🙄
 */
const init = require(join(__dirname, 'bin/webvsc.js'));
