//convert
var componentTable=builtinComponents.concat(dllComponents);function convertPreset(f){var d={};var b=new Uint8Array(f);try{var a=decodePresetHeader(b.subarray(0,presetHeaderLength));d.clearFrame=a;var c=convertComponents(b.subarray(presetHeaderLength));d.components=c}catch(g){if(g instanceof ConvertException){log("Error: "+g.message);return null}else{throw g}}return d}function convertComponents(a){var h=0;var f=[];while(h<a.length){var b=getUInt32(a,h);var e=getComponentIndex(b,a,h);var d=b>builtinMax&&b!==4294967294;var j=getComponentSize(a,h+sizeInt+d*32);if(e<0){var g={type:"Unknown: ("+(-e)+")"}}else{var c=h+sizeInt*2+d*32;var g=window["decode_"+componentTable[e].func](a,c,componentTable[e].fields,componentTable[e].name,c+j)}if(!g||typeof g!=="object"){throw new ConvertException("Unknown convert error")}f.push(g);h+=j+sizeInt*2+d*32}return f}function getComponentIndex(c,a,d){if(c<builtinMax||c===4294967294){for(var b=0;b<componentTable.length;b++){if(c===componentTable[b].code){log("Found component: "+componentTable[b].name+" ("+c+")");return b}}}else{for(var b=builtinComponents.length;b<componentTable.length;b++){if(componentTable[b].code instanceof Array&&cmpBytes(a,d+sizeInt,componentTable[b].code)){log("Found component: "+componentTable[b].name);return b}}}log("Found unknown component (code: "+c+")");return -c}function getComponentSize(a,b){return getUInt32(a,b)}function decodePresetHeader(a){var b=[78,117,108,108,115,111,102,116,32,65,86,83,32,80,114,101,115,101,116,32,48,46,50,26];if(!cmpBytes(a,0,b)){throw new ConvertException("Invalid preset header.")}return a[presetHeaderLength-1]===1}function decode_effectList(a,e){var k=getUInt32(a,e-sizeInt);var g={type:"EffectList",enabled:getBit(a,e,1)[0]!==1,clearFrame:getBit(a,e,0)[0]===1,input:getBlendmodeIn(a,e+2,1)[0],output:getBlendmodeOut(a,e+3,1)[0],inAdjustBlend:getUInt32(a,e+5),outAdjustBlend:getUInt32(a,e+9),inBuffer:getUInt32(a,e+13),outBuffer:getUInt32(a,e+17),inBufferInvert:getUInt32(a,e+21)===1,outBufferInvert:getUInt32(a,e+25)===1,enableOnBeat:getUInt32(a,e+29)===1,onBeatFrames:getUInt32(a,e+33)};var b=[0,64,0,0,65,86,83,32,50,46,56,43,32,69,102,102,101,99,116,32,76,105,115,116,32,67,111,110,102,105,103,0,0,0,0,0];var i=e+37;var f=k-37;var c=i;if(cmpBytes(a,i,b)){i+=b.length;var j=getUInt32(a,i);c+=b.length+sizeInt+j;f=k-37-b.length-sizeInt-j;g.codeEnabled=getUInt32(a,i+sizeInt)===1;var d=getUInt32(a,i+sizeInt*2);g.init=getSizeString(a,i+sizeInt*2)[0];g.frame=getSizeString(a,i+sizeInt*3+d)[0]}var h=convertComponents(a.subarray(c,c+f));g.components=h;return g}function decode_generic(a,g,m,b,e){var l={type:removeSpaces(b)};var r=Object.keys(m);var j=false;for(var h=0;h<r.length;h++){if(g>=e){break}var d=r[h];var n=m[d];if(d.match(/^null[_0-9]*$/)){g+=n;j=false;continue}var t=0;var q,s;var c=typeof n==="number";var p=typeof n==="string";var o=n instanceof Array;if(c){switch(n){case 1:t=1;q=a[g];break;case sizeInt:t=sizeInt;q=getUInt32(a,g);break;default:throw new ConvertException("Invalid field size: "+n+".")}j=false}else{if(p){s=window["get"+n](a,g);q=s[0];t=s[1];j=false}else{if(n&&n.length>=2){if(n[0]==="Bit"){if(j){g-=1}j=true}else{j=false}s=window["get"+n[0]](a,g,n[1]);q=s[0];if(n[2]){q=window["get"+n[2]](q)}t=s[1]}}}l[d]=q;g+=t}return l}function decode_colorMap(a,b){return{type:"ColorMap"}}function getCodePFBI(a,e){var j=new Array(4);var h=0;for(var f=0,c=e;f<4;f++,c+=size+sizeInt){size=getUInt32(a,c);h+=sizeInt+size;j[f]=getSizeString(a,c,true,size)[0]}var d={};var b=[3,1,2,0];var g=["init","onFrame","onBeat","perPoint"];for(var f=0;f<j.length;f++){d[g[f]]=j[b[f]]}return[d,h]}function getColorList(b,e){var a=[];var c=getUInt32(b,e);var d=sizeInt+c*sizeInt;while(c>0){e+=sizeInt;a.push(getColor(b,e)[0]);c--}return[a,d]}function getColor(b,e){var a=getUInt32(b,e).toString(16);var d="";for(var c=a.length;c<6;c++){d+="0"}return["#"+d+a,sizeInt]}function getConvoFilter(b,g,e){if(!(e instanceof Array)&&e.length!==2){throw new ConvertException("ConvoFilter: Size must be array with x and y dimensions in dwords.")}var d=e[0]*e[1];var f=new Array(d);for(var c=0;c<d;c++,g+=sizeInt){f[c]=getInt32(b,g)}var a={width:e[0],height:e[1],data:f};return[a,d*sizeInt]}function getBlendmodeIn(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[blendmodesIn[c],b]}function getBlendmodeOut(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[blendmodesOut[c],b]}function getBlendmodeBuffer(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[blendmodesBuffer[c],b]}function getBlendmodeRender(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[blendmodesRender[c],b]}function getBufferMode(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[buffermodes[c],b]}function getBufferNum(a,d,b){var c=b===1?a[d]:getUInt32(a,d);if(c===0){return["Current",b]}else{return[getUInt32(a,d),b]}}function getCoordinates(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[c?"Cartesian":"Polar",b]}function getLineType(a){return a?"Lines":"Dots"}function getAudioChannel(a){return audioChannels[a]}function getAudioRepresent(a){return audioRepresentations[a]};
//files
function checkCompat(){if(window.File&&window.FileReader&&window.FileList&&window.Blob){compat=true}else{compat=false}}function loadDir(c,e){var a=c.files;var d=[];for(var b=0;b<a.length;b++){if(e.test(a[b].name)){d.push(a[b])}}return d}function loadFile(b,c){if(!b instanceof File){log("Error: 'file' parameter is no file.");return false}if(typeof c!=="function"){log("Error: 'callback' parameter is no function.");return false}log("Loading file "+b.name+"... ");var a=new FileReader();a.onloadend=function(d){if(d.target.readyState==FileReader.DONE){c(d.target.result,b.name)}};a.readAsArrayBuffer(b)};
//main
var compat=false;var outputDir="";var pedanticMode=false;$(document).ready(function(){checkCompat();log("File API check: "+(compat?"success":"fail")+".");var a=[];$("#preset").change(function(){a=loadDir(this,/\.avs$/);log("Found "+a.length+" files in directory.");for(var b=0;b<a.length;b++){loadFile(a[b],saveAvsAsJson)}})});function saveAvsAsJson(d,b){var c={name:b.substr(0,b.length-4),author:"-",components:convertPreset(d)};var a=("#output");$(a).html(JSON.stringify(c,null,"    "));$(a).each(function(f,g){hljs.highlightBlock(g)})}function jsonPrintSpecials(b,a){if(b==="convolutionMatrix"){return a.join(",")}return a};
//util
var sizeInt=4;var presetHeaderLength=25;var builtinMax=16384;function log(a){$("#log").append(a+"\n")}function ConvertException(a){this.message=a;this.name="ConvertException"}function cmpBytes(a,c,d){for(var b=0;b<d.length;b++){if(d[b]===null){continue}if(a[b+c]!==d[b]){return false}}return true}function getUInt32(a,b){if(!b){b=0}var c=a.buffer.slice(a.byteOffset+b,a.byteOffset+b+sizeInt);return new Uint32Array(c,0,1)[0]}function getInt32(a,b){if(!b){b=0}var c=a.buffer.slice(a.byteOffset+b,a.byteOffset+b+sizeInt);return new Int32Array(c,0,1)[0]}function getBit(b,c,d){if(d instanceof Array){if(d.length!==2){new ConvertException("Wrong Bitfield range")}var a=(2<<(d[1]-d[0]))-1;return[(b[c]>>d[0])&a,1]}else{return[((b[c]>>d)&1),1]}}function getBool(a,d,b){var c=b===1?a[d]:getUInt32(a,d);return[c!==0,b]}function getBoolified(a){return a==0?false:true}function getSizeString(d,h,f){var g=0;var a="";if(!f){f=getUInt32(d,h);g=sizeInt}var b=h+f+g;var e=h+g;var j=d[e];while(j>0&&e<b){a+=String.fromCharCode(j);j=d[++e]}return[a,f+g]}function getNtString(b,e){var a="";var d=e;var f=b[d];while(f>0){a+=String.fromCharCode(f);f=b[++d]}return[a,d-e]}function removeSpaces(a){return a.replace(/[ ]/g,"")};
//highlight
hljs.initHighlightingOnLoad();
//select
function SelectText(element){var doc=document;var text=doc.getElementById(element);if(doc.body.createTextRange){var range=doc.body.createTextRange();range.moveToElementText(text);range.select()}else{if(window.getSelection){var selection=window.getSelection();var range=doc.createRange();range.selectNodeContents(text);selection.removeAllRanges();selection.addRange(range)}}};
$(function(){$("#output").click(function(){SelectText("output")})});