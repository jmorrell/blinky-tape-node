var Blinky = require('./blinky.js');
var max = require('lodash.max');

var b = new Blinky('/dev/tty.usbmodem1411');
var l, x;

b.on('ready', function() {
  function loop() {
    for (var y = 0; y < 60; y++) {
      l = max([y - x > 0 ? ((y - x) % 60) - 40 : ((y - x) % 60) + 20, 0]);
      b.setPixel(y, l * 3, l * 3, l * 3);
    }
    b.show();

    x += 1;
    x = x % 60;
    setTimeout(loop, 10);
  }

  x = 50;
  loop();
});


