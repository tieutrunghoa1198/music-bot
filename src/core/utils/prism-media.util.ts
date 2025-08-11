import * as Prism from 'prism-media';

/**
 * @docs Function for get another stream based on seeked time
 * @param stream readable stream (audio, ...)
 * @param seekTime measured in seconds (s)
 *
 * @return Prism.opus.Encoder
 */
export const createFFmpegStream = (stream: any, seekTime: number) => {
  let seekPosition = '0';

  if (seekTime) seekPosition = String(seekTime);

  const transcoder = new Prism.FFmpeg({
    args: [
      '-analyzeduration',
      '0',
      '-loglevel',
      '0',
      '-f',
      's16le',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-ss',
      seekPosition,
      '-ab',
      '320',
    ],
  });
  const s16le = stream.pipe(transcoder);

  const encoder = new Prism.opus.Encoder({
    rate: 48000,
    channels: 2,
    frameSize: 960,
  });

  const cleanup = () => {
    transcoder.destroy();
    stream.destroy?.();
  };

  encoder.once('close', cleanup);
  encoder.once('end', cleanup);

  s16le.pipe(encoder);
  return encoder; // Return seeked stream
};
