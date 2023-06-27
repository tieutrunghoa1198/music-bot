import {Player, players} from "../../../models/player";
import {Client, Message} from "discord.js";
import {MusicAreas} from '../../../../mongodb/music-area.model'
import {PlayerService} from "../../../../services/music/PlayerService";
import messages from "../../../../constants/messages";
import {InputType} from "../../../../types/InputType";

const handleYoutubeLink = async (msg: Message, client: Client) => {
    await MusicAreas
        .findOne(
            {textChannelId: msg.channel.id},
            async (err: any, musicAreaChannel: any) => {
                if (msg === null || msg === undefined) {
                    //@ts-ignore
                    await msg.channel.send('Message Deleted');
                    return;
                }

                if (!msg.content.startsWith('http')) {
                    return;
                }

                if (musicAreaChannel === null || musicAreaChannel === undefined) {
                    console.log('not found music area in this guild')
                    return;
                }

                const processingMsg = await msg.channel.send(messages.processing);
                const voiceChannel = msg.member?.voice.channel;
                if (!voiceChannel) {
                    await msg.channel.send(messages.userJoinVoiceChannel(msg.author.toString()));
                    await processingMsg.delete().catch((err: any) => {
                        console.log(err);
                    });
                    return;
                }
                let player = players.get(msg.guildId as string) as Player;

                if (!player) {
                    player = await PlayerService.createPlayer(msg, client);
                }
                const requester = msg.member?.user.username || '';
                const linkType = await PlayerService.classify(msg.content);

                try {
                    await PlayerService.enterReadyState(player);
                }catch (e) {
                    await msg.channel.send(messages.joinVoiceChannel);
                    console.log('cannot enter ready state')
                    return;
                }

                try {
                    if (linkType === '') return;
                    await PlayerService.process(
                        msg.content,
                        linkType,
                        InputType.MESSAGE,
                        player,
                        requester,
                        msg)
                } catch (e) {
                    console.log(err);
                    await msg.channel.send(messages.error);
                } finally {
                    if (processingMsg.deletable) {
                        await processingMsg.delete().catch((err: any) => {
                            console.log(err)
                        })
                    }
                }
    }).clone()
}

export default {
    handleYoutubeLink
}
