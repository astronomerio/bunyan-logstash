const { assert } = require('chai');
const sinon = require('sinon');
const udp = require('../lib/index');
const bunyan = require('bunyan');

describe('udp stream', () => {
  let udpStream;
  let sendStub;
  let log;
  let message;

  beforeEach(() => {
    udpStream = udp.createStream();
    sendStub = sinon.stub(udpStream.client, 'send');
    log = bunyan.createLogger({
      name: 'foo',
      serializers: { err: bunyan.stdSerializers.err },
      streams: [{
        stream: udpStream,
        reemitErrorEvents: true,
      }],
    });
    message = {
      event: 'forward_event',
      writeKey: 'my_write_key',
      err: new Error('Uh oh'),
    };
  });

  it('works', () => {
    log.info(message);

    // can't test that it's the correct buffer, so just check that it is a buffer
    const args0 = sendStub.firstCall.args[0];
    assert.isTrue(Buffer.isBuffer(args0));
    assert.isTrue(sendStub.firstCall.args[1] === 0);
    assert.isTrue(sendStub.firstCall.args[2] === args0.length);
    assert.isTrue(sendStub.firstCall.args[3] === 5000);
    assert.isTrue(sendStub.firstCall.args[4] === '127.0.0.1');
  });

  it('reemits errors to bunyan', (done) => {
    log.on('error', () => {
      done();
    });
    udpStream.client.emit('error');
  });
});
