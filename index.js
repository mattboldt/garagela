
const fs = require('fs'),
      nmea = require('@drivetech/node-nmea'),
      geolib = require('geolib')
      Garage = require('./garage');

const PATH = '/dev/cu.usbmodem14201',
      METERS = 10,
      HOME_LONGITUDE = -96.65558533333333,
      HOME_LATITUDE = 33.223642166666664;

const garage = new Garage();

const readStream = fs.createReadStream(PATH);
readStream.on('data', (chunk) => {
  let data = chunk.toString().split('\r\n');

  for (let line of data) {
    const gps = nmea.parse(line);
    if (gps.valid) {
      const [longitude, latitude] = gps.loc.geojson.coordinates;

      const isHome = geolib.isPointWithinRadius(
        { latitude, longitude },
        { latitude: HOME_LATITUDE, longitude: HOME_LONGITUDE },
        METERS
      );

      if (isHome) {
        console.log('Home -- Open triggered');
        garage.open();
      } else {
        console.log('Away -- Close triggered');
        garage.close();
      }
    }
  }
});

const sample = {
  geojson: {
    type: 'Point',
    coordinates: [ -96.65558816666666, 33.223613 ]
  },
  dmm: {
    latitude: '3313.41678,N',
    longitude: '09639.33529,W'
  }
}
