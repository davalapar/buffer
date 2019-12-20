/* eslint-disable no-bitwise, no-param-reassign, no-console */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const concat = (...buffers) => {
  let length = 0;
  for (let i = 0, l = buffers.length; i < l; i += 1) {
    length += buffers[i].length;
  }
  const buffer = new Uint8Array(length);
  buffer.set(buffers[0]);
  let offset = 0;
  for (let i = 1, l = buffers.length; i < l; i += 1) {
    offset += buffers[i - 1].length;
    buffer.set(buffers[i], offset);
  }
  return buffer;
};

const fromStr = string => encoder.encode(string);
const toStr = buffer => decoder.decode(buffer);

// console.log(concat(fromStr('fak'), fromStr('yeh'), fromStr('fak'), fromStr('yeh')));
// console.log(toStr(concat(fromStr('fak'), fromStr('yeh'), fromStr('fak'), fromStr('yeh'))));

const writeInt16BE = (buffer, offset, value) => { // 2 bytes
  if (value < -32768 || value > 32767 || Math.floor(value) !== value) {
    throw Error('writeUInt16BE: Must be integer between 0-32767');
  }
  buffer[offset] = value >> 8;
  buffer[offset + 1] = value & 0xff;
  return buffer;
};
const readInt16BE = (buffer, offset) => { // 2 bytes
  const value = buffer[offset + 1] | (buffer[offset] << 8);
  return value & 0x8000 ? value | 0xFFFF0000 : value;
};
const writeUInt16BE = (buffer, offset, value) => { // 2 bytes
  if (value < 0 || value > 65535 || Math.floor(value) !== value) {
    throw Error('writeUInt16BE: Must be integer between 0-65535');
  }
  buffer[offset] = value >> 8;
  buffer[offset + 1] = value & 0xff;
  return buffer;
};
const readUInt16BE = (buffer, offset) => (buffer[offset] << 8) | buffer[offset + 1]; // 2 bytes

const encoded = writeInt16BE(new Uint8Array(2), 0, -32768);
const decoded = readInt16BE(encoded, 0);
console.log({ encoded, decoded });

const hd = new Array(255); // pre-computed string equivalents
const h = '0123456789abcdef'; // lowercase hex characters
for (let i = 0, l = 255; i < l; i += 1) {
  hd[i] = h[i >> 4] + h[i & 15];
}
const toHex = (buffer) => {
  let string = '';
  for (let i = 0, l = buffer.length; i < l; i += 1) {
    string += hd[buffer[i]];
  }
  return string;
};

const encoded2 = concat(fromStr('fak'), fromStr('yeh'), fromStr('fak'), fromStr('yeh'));
console.log(toHex(encoded2));
console.log(toStr(encoded2));
