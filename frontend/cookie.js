/*!
 * JavaScript Cookie v2.0.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function(a){if(typeof define==="function"&&define.amd){define(a)}else{if(typeof exports==="object"){module.exports=a()}else{var c=window.Cookies;var b=window.Cookies=a();b.noConflict=function(){window.Cookies=c;return b}}}}(function(){function b(){var f=0;var c={};for(;f<arguments.length;f++){var d=arguments[f];for(var e in d){c[e]=d[e]}}return c}function a(d){function c(o,n,k){var r;if(arguments.length>1){k=b({path:"/"},c.defaults,k);if(typeof k.expires==="number"){var h=new Date();h.setMilliseconds(h.getMilliseconds()+k.expires*86400000);k.expires=h}try{r=JSON.stringify(n);if(/^[\{\[]/.test(r)){n=r}}catch(m){}n=encodeURIComponent(String(n));n=n.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);o=encodeURIComponent(String(o));o=o.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);o=o.replace(/[\(\)]/g,escape);return(document.cookie=[o,"=",n,k.expires&&"; expires="+k.expires.toUTCString(),k.path&&"; path="+k.path,k.domain&&"; domain="+k.domain,k.secure?"; secure":""].join(""))}if(!o){r={}}var q=document.cookie?document.cookie.split("; "):[];var p=/(%[0-9A-Z]{2})+/g;var l=0;for(;l<q.length;l++){var j=q[l].split("=");var f=j[0].replace(p,decodeURIComponent);var g=j.slice(1).join("=");if(g.charAt(0)==='"'){g=g.slice(1,-1)}try{g=d&&d(g,f)||g.replace(p,decodeURIComponent);if(this.json){try{g=JSON.parse(g)}catch(m){}}if(o===f){r=g;break}if(!o){r[f]=g}}catch(m){}}return r}c.get=c.set=c;c.getJSON=function(){return c.apply({json:true},[].slice.call(arguments))};c.defaults={};c.remove=function(f,e){c(f,"",b(e,{expires:-1}))};c.withConverter=a;return c}return a()}));