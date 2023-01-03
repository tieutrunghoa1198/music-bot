import {Client} from "discord.js";
import {TrackSelectMenu} from "./music/track.selectmenu";
import messages from "../constants/messages";
export class SelectMenuController {
    public static handle (client: Client) {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;
            await interaction.deferReply();
            try {
                await TrackSelectMenu.interaction(interaction, client);
            } catch (e) {
                console.log(e);
                await interaction.followUp(messages.error + ': Select menu track!');
            }
        });
    }
}
