import {Client} from "discord.js";
import {HandleInteraction} from "./command/handleInteraction";
import {handleSelectMenu} from "./selectmenu/handleSelectMenu";
import {handleButton} from "./button/handleButton";

export const InteractionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: any) => {
        if (interaction.isCommand()) {
            await HandleInteraction.slashCommand(interaction, client);
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
            await HandleInteraction.autoComplete(interaction, client);
        }
    })
}
