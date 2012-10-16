/*
	PNG Storage library heavily inspired by; 
		http://blog.nihilogic.dk/2008/05/compression-using-canvas-and-png.html

*/

if (typeof(PNGStorage) === "undefined") var PNGStorage = {};

(function() {

PNGStorage.decode = function (data, callback) { // nihilogic canvas decompressor
	if (!data.length) return;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var image = new Image();
	image.style.position = "absolute";
	image.style.left = "-10000px";
	document.body.appendChild(image);
	image.onload = function () {
		var width = this.offsetWidth;
		var height = this.offsetHeight;
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		ctx.drawImage(this, 0, 0);
		var data = ctx.getImageData(0, 0, width, height).data;
		var a = "";
		var len = data.length;
		var p = -1;
		for (var i = 0; i < len; i += 4) {
			if (data[i + 0]) a += String.fromCharCode(data[i + 0]);
			if (data[i + 1]) a += String.fromCharCode(data[i + 1]);
			if (data[i + 2]) a += String.fromCharCode(data[i + 2]);
		}
		if (callback) callback(a);
		document.body.removeChild(image);
	}
	image.src = data;
	return true;
};

PNGStorage.encode = function (data) {
	if (!data.length) return;
	var filesize = data.length;
	var width = Math.ceil(Math.sqrt(filesize / 3));
	var height = width;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
	var imageData = ctx.getImageData(0, 0, width, height);
	var im = imageData.data;
	var i = 0;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var pos = y * width * 4 + x * 4;
			var d0 = data[i++];
			var d1 = data[i++];
			var d2 = data[i++];
			if (d0 || d1 || d2) {
				if (d0) im[pos] = ord(d0);
				if (d1) im[pos + 1] = ord(d1);
				if (d2) im[pos + 2] = ord(d2);
				im[pos + 3] = 255;
			}
		}
	}
	ctx.putImageData(imageData, 0, 0);
	return ctx.canvas.toDataURL();
};

var ord = function (string) { // via php.js (MIT License)
	var str = string + "";
	var code = str.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF) {
		var hi = code;
		if (str.length === 1) return code;
		var low = str.charCodeAt(1);
		return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	}
	if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		return code;
	}
	return code;
};

})();