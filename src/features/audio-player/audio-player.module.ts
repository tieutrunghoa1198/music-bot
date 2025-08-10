import { registerMessageMusicListener } from './listeners/message-music.listener';
import { registerVoiceListener } from './listeners/voice.listener';

export const initAudioPlayer = () => {
  registerMessageMusicListener();
  registerVoiceListener();
};
