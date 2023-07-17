import {Client} from "discord.js";
import {InteractionHandling} from "../mvc/controllers/command/interactionHandling";
import {handleSelectMenu} from "../mvc/controllers/selectmenu/index.selectmenu";
import {handleButton} from "../mvc/controllers/button/index.button";

export const InteractionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: any) => {
        if (interaction.isCommand()) {
            const slashCmd = new InteractionHandling(interaction, client);
            await slashCmd.slashCommand();
        }

        if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();
            await handleSelectMenu(interaction, client);
        }

        if (interaction.isButton()) {
            await interaction.deferUpdate();
            await handleButton(interaction, client);
        }

        if (interaction.isAutocomplete()) {
            const slashCmd = new InteractionHandling(interaction, client);
            await slashCmd.autoComplete();
        }
    })
}
