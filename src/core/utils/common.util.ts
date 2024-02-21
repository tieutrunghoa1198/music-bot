import {InputType} from "@/core/types/input-type.type";
import * as Constant from "@/core/constants/index.constant";
import {SoundCloudService} from "@/core/services/music/soundcloud.service";
import play from "play-dl";
import {ObjectValues} from "@/core/types/common.types";

export const exactMatch = (a: any, b: any) => {
    a = a.split(' ');
    b = b.split(' ');
    let s: any = [];
    let out = [];
    let x = a.map((x: any) => b.includes(x) ? x : null);
    x.forEach((v: any) => {
        if (v == null) {
            out.push(s);
            s = [];
        } else {
            s.push(v);
        }
    });
    out.push(s);
    out = out.map(x => x.join(' ')).filter(x => x);
    return out;
}

export const limitString = (text: string, limit: number) => {
    if (text.length > limit) {
        text = text.slice(0, limit);
    }
    return text;
}

export const ephemeralResponse = async (interaction: any, message: string) => {
    await interaction.followUp({
        content: message,
        ephemeral: true
    });
}

export const classifyInteraction = (interactionObject: any): InputType => {
    return MAP_INTERACTION_TYPE.get(interactionObject.type) ?? InputType.DEFAULT;
}

export const classifyUrl = async (url: string) => {
    let urlType: Constant.Link;
    switch (true) {
        // @ts-ignore
        case url.match(Constant.youtubeVideoRegex)?.length > 0:
            if (url.includes('&list=RD')) urlType = Constant.Link.YoutubeRandomList;
            else urlType = Constant.Link.YoutubeTrack;
            break;
        // @ts-ignore
        case url.match(Constant.soundCloudTrackRegex)?.length > 0:
            if (SoundCloudService.isPlaylist(url)) urlType = Constant.Link.SoundCloudPlaylist
            else urlType = Constant.Link.SoundCloudTrack;
            break;
        case url.startsWith('https://open.spotify.com/'):
            let track = await play.spotify(url);
            switch (track.type) {
                case "playlist":
                    urlType = Constant.Link.SpotifyPlaylist;
                    break;
                case "album":
                    urlType = Constant.Link.SpotifyAlbum;
                    break;
                case "track":
                    urlType = Constant.Link.SpotifyTrack;
            }
            break;
        default:
            urlType = Constant.Link.Empty;
    }
    return urlType;
}

export const getRequester = (interactionObj: any) => {
    return interactionObj.member?.user.username || '';
}

export function enterReadyState() {

}

export const MAP_INTERACTION_TYPE = new Map<InputType, InputType>([
    [InputType.INTERACTION, InputType.INTERACTION],
    [InputType.MESSAGE_COMPONENT, InputType.MESSAGE_COMPONENT],
    [InputType.DEFAULT, InputType.DEFAULT],
]);


