import test from 'node:test';
import assert from 'node:assert';
import { PassThrough } from 'node:stream';

class MockFFmpeg extends PassThrough {
  static active = 0;
  static maxActive = 0;
  static lastInstance: MockFFmpeg | null = null;
  destroyed = false;

  constructor() {
    super();
    MockFFmpeg.active++;
    if (MockFFmpeg.active > MockFFmpeg.maxActive) {
      MockFFmpeg.maxActive = MockFFmpeg.active;
    }
    MockFFmpeg.lastInstance = this;
  }

  override destroy(err?: Error) {
    if (!this.destroyed) {
      this.destroyed = true;
      MockFFmpeg.active--;
    }
    return super.destroy(err);
  }
}

class MockEncoder extends PassThrough {}

const prismPath = require.resolve('prism-media');
(require.cache as any)[prismPath] = {
  id: prismPath,
  filename: prismPath,
  loaded: true,
  exports: { FFmpeg: MockFFmpeg, opus: { Encoder: MockEncoder } },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createFFmpegStream } = require('../prism-media.util');

class MockSourceStream extends PassThrough {
  destroyed = false;
  override destroy(err?: Error) {
    if (!this.destroyed) this.destroyed = true;
    return super.destroy(err);
  }
}

test('cleanup on encoder close', () => {
  MockFFmpeg.active = 0;
  const source = new MockSourceStream();
  const encoder = createFFmpegStream(source, 0) as MockEncoder;
  encoder.emit('close');
  encoder.destroy();
  assert.strictEqual(MockFFmpeg.lastInstance?.destroyed, true);
  assert.strictEqual(source.destroyed, true);
});

test('cleanup on encoder end', () => {
  MockFFmpeg.active = 0;
  const source = new MockSourceStream();
  const encoder = createFFmpegStream(source, 0) as MockEncoder;
  encoder.emit('end');
  encoder.destroy();
  assert.strictEqual(MockFFmpeg.lastInstance?.destroyed, true);
  assert.strictEqual(source.destroyed, true);
});

test('only one ffmpeg active at a time', () => {
  MockFFmpeg.active = 0;
  MockFFmpeg.maxActive = 0;
  const firstSource = new MockSourceStream();
  const firstEncoder = createFFmpegStream(firstSource, 0) as MockEncoder;
  firstEncoder.emit('close');
  firstEncoder.destroy();
  const secondSource = new MockSourceStream();
  const secondEncoder = createFFmpegStream(secondSource, 0) as MockEncoder;
  secondEncoder.emit('close');
  secondEncoder.destroy();
  assert.ok(MockFFmpeg.maxActive <= 1);
});
