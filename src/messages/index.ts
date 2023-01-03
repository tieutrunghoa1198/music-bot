import {Client, Message} from "discord.js";
import MessageMusicController from './music/play.msg'
import MessageRestrictController from './control-message/restrict.msg';
export class MessageController {
    public static handle (client: Client) {
        client.on('messageCreate', async (msg: Message) => {
            await MessageMusicController.handleYoutubeLink(msg, client);
            await MessageRestrictController.restrict(msg, client);
        })
    }
}
