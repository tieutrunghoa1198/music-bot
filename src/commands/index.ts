import {Client, Collection, Interaction} from "discord.js";
import {registerGlobalCommand} from "./collections/deploy";
import pingCommand from "./collections/ping.command";

export const bootstrap = async (client: Client) => {
    await registerGlobalCommand(client)
        .catch(err => console.log(err));

    await interactionCreate(client)
        .catch(err => console.log(err))
};

const interactionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        try {
            switch (interaction.commandName) {
                case pingCommand.data.name:
                    await pingCommand.execute(interaction);
                    break;
            }
        } catch (e) {
            await interaction.reply('co  loi xay ra');
        }
    })
}
