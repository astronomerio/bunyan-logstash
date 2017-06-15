const dgram = require('dgram');
const { Writable } = require('stream');

class UDPStream extends Writable {
  constructor(options = {}) {
    super(options);

    this.host = options.host || '127.0.0.1';
    this.port = options.port || 5000;

    this.client = dgram.createSocket('udp4');
    this.client.on('error', (err) => {
      this.emit('error', err);
    });
  }

  write(chunk) {
    const buf = Buffer.from(chunk);
    this.client.send(buf, 0, buf.length, this.port, this.host);
  }
}

function createUDPStream(options) {
  return new UDPStream(options);
}

module.exports = {
  createStream: createUDPStream,
  UDPStream,
};
