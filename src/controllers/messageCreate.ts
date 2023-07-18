import {Client, Message} from "discord.js";
import MessageMusicController from "./message/music/play.msg";
import MessageRestrictController from "./message/control-message/restrict.msg";

export const MessageCreate = async (client: Client) => {
    client.on('messageCreate', async (msg: Message) => {
        await MessageMusicController.handleLink(msg, client);
        await MessageRestrictController.restrict(msg, client);
    })
}
