import React from 'react';
import AudioPlayerClip from './AudioPlayerClip';

const AudioPlayerFC: React.FC<{
  clips: AudioPlayerClip[];
}> = ({ clips }) => (
  <div style={{ display: 'none' }}>
    {clips.map(({ src, loop }) => (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio src={src} key={src} autoPlay loop={!!loop} />
    ))}
  </div>
);

export default AudioPlayerFC;
