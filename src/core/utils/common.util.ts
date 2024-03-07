import { InputType } from '@/core/types/input-type.type';
import * as Constant from '@/core/constants/index.constant';
import { SoundCloudService } from '@/core/services/music/soundcloud.service';
import play from 'play-dl';
import { ObjectValues } from '@/core/types/common.types';

export const exactMatch = (a: any, b: any) => {
  a = a.split(' ');
  b = b.split(' ');
  let s: any = [];
  let out = [];
  const x = a.map((x: any) => (b.includes(x) ? x : null));
  x.forEach((v: any) => {
    if (v == null) {
      out.push(s);
      s = [];
    } else {
      s.push(v);
    }
  });
  out.push(s);
  out = out.map((x) => x.join(' ')).filter((x) => x);
  return out;
};

export const limitString = (text: string, limit: number) => {
  if (text.length > limit) {
    text = text.slice(0, limit);
  }
  return text;
};

export const ephemeralResponse = async (interaction: any, message: string) => {
  await interaction.followUp({
    content: message,
    ephemeral: true,
  });
};

export const classifyInteraction = (interactionObject: any): InputType => {
  return MAP_INTERACTION_TYPE.get(interactionObject.type) ?? InputType.DEFAULT;
};

export const classifyUrl = async (url: string) => {
  let urlType: Constant.Link;

  switch (true) {
    case url.match(Constant.youtubeVideoRegex) !== null:
      (url.includes('&list=RD'))
        ? urlType = Constant.Link.YoutubeRandomList
        : urlType = Constant.Link.YoutubeTrack;
      break;
    case url.match(Constant.soundCloudTrackRegex) !== null:
      (SoundCloudService.isPlaylist(url))
        ? urlType = Constant.Link.SoundCloudPlaylist
        : urlType = Constant.Link.SoundCloudTrack;
      break;
    default:
      urlType = Constant.Link.Empty;
      break;
  }

  return urlType;
};

export const getRequester = (interactionObj: any) => {
  return interactionObj.member?.user.username || '';
};

export const MAP_INTERACTION_TYPE = new Map<InputType, InputType>([
  [InputType.INTERACTION, InputType.INTERACTION],
  [InputType.MESSAGE_COMPONENT, InputType.MESSAGE_COMPONENT],
  [InputType.DEFAULT, InputType.DEFAULT],
]);
