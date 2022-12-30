import {Client, Message} from "discord.js";
import {Player, players} from "../models/player";
import MessageMusicCommand from './music/play.message'
export class MessageHandler {
    public static handle (client: Client) {
        client.on('messageCreate', async (msg: Message) => {
            await MessageMusicCommand.handleYoutubeLink(msg);
        })
    }
}
