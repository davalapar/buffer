/* eslint-disable no-console */

const { read, write } = require('./index');

for (let x = 0, y = 255; x <= y; x += 1) {
  const encoded = write.UInt8(new Uint8Array(4), 0, x);
  const decoded = read.UInt8(encoded, 0);
  console.log({ encoded, decoded });
}
