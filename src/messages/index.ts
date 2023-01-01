import {Client, Message} from "discord.js";
import {Player, players} from "../models/player";
import MessageMusicController from './music/play.msg'
import MessageController from './control-message/restrict.msg';
export class MessageHandler {
    public static handle (client: Client) {
        client.on('messageCreate', async (msg: Message) => {
            await MessageMusicController.handleYoutubeLink(msg);
            await MessageController.restrict(msg, client);
        })
    }
}
