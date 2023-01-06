import {Client} from "discord.js";
import {TrackSelectMenu} from "./music/track.selectmenu";
import messages from "../../../constants/messages";
import {RecordSelectMenu} from "./music/record.selectmenu";
export class SelectMenuController {
    public static handle (client: Client) {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            await interaction.deferReply();
            try {
                await TrackSelectMenu.interaction(interaction, client);
                await RecordSelectMenu.interaction(interaction, client);
            } catch (e) {
                console.log(e);
                await interaction.followUp(messages.error + ': Select menu track!');
            }
        });
    }
}
