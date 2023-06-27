require('dotenv').config()
import {Client} from 'discord.js';
import {DeployCommands} from "./command-controllers/deployCommands";
import {InteractionHandling} from "./command-controllers/interactionHandling";
import {MessageController} from "./message-controllers/index.message";
import {handleSelectMenu} from "./selectmenu-controllers/index.selectmenu";
import {handleButton} from "./button-controllers/index.button";
export const bootstrap = async (client: Client) => {
    try {
        new DeployCommands();
        await interactionCreate(client)
            .catch(err => console.log(err));
        await MessageController.handle(client);
    } catch (e) {
        console.log(e, 'Error: at index.command.ts');
    }
};

const interactionCreate = async (client: Client) => {
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




