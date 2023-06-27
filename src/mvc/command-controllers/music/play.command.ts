import {SlashCommandBuilder} from "@discordjs/builders";
import {Player, players} from "../../models/player";
import messages from "../../../constants/messages";
import {MusicCommands} from '../../../constants/musicCommands';
import {PlayFeature} from "../../models/play";
import {Client} from "discord.js";
import {InputType} from "../../../types/InputType";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.play.name)
        .setDescription(MusicCommands.play.description)
        .setDMPermission(false)
        .addStringOption(option => option.setName('input')
            .setDescription('Link to be played')
            .setRequired(true)),
    async execute(interaction: any, client: Client) {
        let input = interaction.options.getString('input');
        if (input === null) {
            await interaction.followUp(messages.error);
            return;
        }
        let player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            player = await PlayFeature.createPlayer(interaction, client);
        }
        const username = interaction.member?.user.username || '';
        const linkType = await PlayFeature.classify(input);
        try {
            await PlayFeature.enterReadyState(player);
        }catch (e) {
            await interaction.followUp(messages.joinVoiceChannel);
            console.log('cannot enter ready state')
            return;
        }
        try {
            await PlayFeature.process(
                input,
                linkType,
                InputType.INTERACTION,
                player,
                username,
                interaction);
        } catch (e) {
            console.log(e);
            await interaction.followUp(messages.error);
        } finally {
            if (interaction.deletable) {
                await interaction.deleteReply();
            }
        }
    }
}




