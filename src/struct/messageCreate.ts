import {Client, Message} from "discord.js";
import MessageMusicController from "../mvc/controllers/message/music/play.msg";
import MessageRestrictController from "../mvc/controllers/message/control-message/restrict.msg";

export const MessageCreate = async (client: Client) => {
    client.on('messageCreate', async (msg: Message) => {
        await MessageMusicController.handleYoutubeLink(msg, client);
        await MessageRestrictController.restrict(msg, client);
    })
}
