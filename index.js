/* eslint-disable no-bitwise, no-param-reassign, no-console */

const isNumber = value => typeof value === 'number'
  && Number.isNaN(value) === false
  && Number.isFinite(value) === true;

const isInteger = Number.isInteger
  ? value => typeof value === 'number'
    && Number.isNaN(value) === false
    && Number.isFinite(value) === true
    && Number.isInteger(value) === true
  : value => typeof value === 'number'
    && Number.isNaN(value) === false
    && Number.isFinite(value) === true
    && Math.floor(value) === value;

const isFloat = value => typeof value === 'number'
  && Number.isNaN(value) === false
  && Number.isFinite(value) === true
  && Math.fround(value) === value;

const isDouble = value => typeof value === 'number'
  && Number.isNaN(value) === false
  && Number.isFinite(value) === true
  && Math.fround(value) !== value;

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

const write = {
  Int16BE: (buffer, offset, value) => { // 2 bytes
    if (value < -32768 || value > 32767 || Math.floor(value) !== value) {
      throw Error('write.Int16BE : Must be an integer between -32768 and +32767');
    }
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value & 255;
    return buffer;
  },
  UInt16BE: (buffer, offset, value) => { // 2 bytes
    if (value < 0 || value > 65535 || Math.floor(value) !== value) {
      throw Error('write.UInt16BE : Must be an integer between 0 and 65535');
    }
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value & 255;
    return buffer;
  },
  Int32BE: (buffer, offset, value) => { // 4 bytes
    if (value < -2147483648 || value > 2147483647 || Math.floor(value) !== value) {
      throw Error('write.Int32BE : Must be an integer between -2147483648 and +2147483647');
    }
    buffer[offset] = value >> 24;
    buffer[offset + 1] = value >> 16;
    buffer[offset + 2] = value >> 8;
    buffer[offset + 3] = value & 255;
    return buffer;
  },
  UInt32BE: (buffer, offset, value) => { // 4 bytes
    if (value < 0 || value > 4294967295 || Math.floor(value) !== value) {
      throw Error('write.UInt32BE : Must be an integer between 0 and +4294967295');
    }
    buffer[offset] = value >> 24;
    buffer[offset + 1] = value >> 16;
    buffer[offset + 2] = value >> 8;
    buffer[offset + 3] = value & 255;
    return buffer;
  },
};
const read = {
  Int16BE: (buffer, offset) => { // 2 bytes
    const value = buffer[offset + 1] | (buffer[offset] << 8);
    return value & 32768 ? value | 4294901760 : value;
  },
  UInt16BE: (buffer, offset) => (buffer[offset] << 8)
    | buffer[offset + 1],
  Int32BE: (buffer, offset) => (buffer[offset] << 24)
    | (buffer[offset + 1] << 16)
    | (buffer[offset + 2] << 8)
    | (buffer[offset + 3]),
  UInt32BE: (buffer, offset) => (buffer[offset] * 16777216)
    + ((buffer[offset + 1] << 16)
    | (buffer[offset + 2] << 8)
    | buffer[offset + 3]),
};

const encoded = write.UInt32BE(new Uint8Array(4), 0, 4294967295);
const decoded = read.UInt32BE(encoded, 0);
console.log({ encoded, decoded });

const hd = new Array(255); // pre-computed string equivalents
const rhd = {}; // reversed pre-computed string equivalents
const h = '0123456789abcdef'; // lowercase hex characters
for (let i = 0, l = 255; i < l; i += 1) {
  const str = h[i >> 4] + h[i & 15];
  hd[i] = str;
  rhd[str] = i;
}
const toHex = (buffer) => {
  let string = '';
  for (let i = 0, l = buffer.length; i < l; i += 1) {
    string += hd[buffer[i]];
  }
  return string;
};
const fromHex = (string) => {
  const length = string.length / 2;
  if (length % 2 !== 0) {
    throw Error('fromHex : Invalid string length');
  }
  const buffer = new Uint8Array(length);
  for (let i = 0, l = string.length; i < l; i += 2) {
    const segment = string.substring(i, i + 2);
    if (rhd[segment] === undefined) {
      throw Error('fromHex : Invalid string segment');
    }
    buffer[i === 0 ? 0 : i / 2] = rhd[segment];
  }
  return buffer;
};

const encoded2 = concat(fromStr('fak'), fromStr('yeh'), fromStr('fak'), fromStr('yeh'));
console.log(encoded2);
console.log(toHex(encoded2));
console.log(toStr(encoded2));
console.log(fromHex(toHex(encoded2)));
console.log(toStr(fromHex(toHex(encoded2))));
