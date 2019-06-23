const fs = require('fs'),
      gpio = require('rpi-gpio'),
      GPIO_PIN = 7,
      PATH = '/home/pi/garagela/open.txt';

class Garage {
  constructor() {
    this.remote = new Remote();
  }

  get isOpen() {
    try {
      if (fs.existsSync(PATH)) {
        return true;
      } else {
        return false;
      }
    } catch(_) {
      return false;
    }
  }

  open() {
    if (!this.isOpen) {
      console.log('Open command sent');

      this.remote.on();
      fs.openSync(PATH, 'w');
    }
  }

  close() {
    if (this.isOpen) {
      console.log('Close command sent');

      this.remote.on();
      fs.unlinkSync(PATH);
    }
  }
}

class Remote {
  setup(fn) {
    gpio.setup(GPIO_PIN, gpio.DIR_OUT, fn);
  }

  on() {
    try {
      this.setup(() => {
        gpio.write(GPIO_PIN, 1);
      });
    } catch {
      console.error('could not trigger GPIO on')
    }

    setTimeout(this.off, 5000);
  }

  off() {
    try {
      gpio.write(GPIO_PIN, 0);
      this.close();
    } catch {
      console.error('could not trigger GPIO off');
    }
  }

  close() {
    gpio.destroy(() => {
      console.log('Closed GPIO');
    });
  }
}

module.exports = Garage;
