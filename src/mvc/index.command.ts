require('dotenv').config()
import {Client} from 'discord.js';
import {DeployCommands} from "./controllers/command/deployCommands";
import {InteractionHandling} from "./controllers/command/interactionHandling";
import {MessageController} from "./controllers/message/index.message";
import {handleSelectMenu} from "./controllers/selectmenu/index.selectmenu";
import {handleButton} from "./controllers/button/index.button";
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




