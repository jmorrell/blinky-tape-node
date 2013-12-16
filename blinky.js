var SerialPort = require('serialport').SerialPort;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var control = new Buffer(3);
control[0] = 0;
control[1] = 0;
control[2] = 255;

function blankPixel() {
  var b = new Buffer(3);
  b[0] = 0;
  b[1] = 0;
  b[2] = 0;
  return b;
}

function Blinky(port) {
  var self = this;

  this.buffers = [];
  for (var i = 0; i < 60; i++) {
    this.buffers.push(blankPixel());
  }
  this.buffers.push(control);

  this.serialPort = new SerialPort(port, { baudrate: 115200 });
  this.serialPort.on('open', function() {
    self.emit('ready');
  });
}

util.inherits(Blinky, EventEmitter);

Blinky.prototype.setPixel = function(pixelIndex, r, g, b) {
  if (pixelIndex > 60 || pixelIndex < 0) {
    return;
  }

  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;
  if (r >= 255) r = 254;
  if (g >= 255) g = 254;
  if (b >= 255) b = 254;

  this.buffers[pixelIndex][0] = r;
  this.buffers[pixelIndex][1] = g;
  this.buffers[pixelIndex][2] = b;
};

Blinky.prototype.show = function(callback) {
  this.serialPort.write(Buffer.concat(this.buffers), callback);
};

Blinky.prototype.close = function() {
  this.serialPort.close();
};

module.exports = Blinky;

