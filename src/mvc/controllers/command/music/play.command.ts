import {SlashCommandBuilder} from "@discordjs/builders";
import {Player, players} from "../../../models/player";
import messages from "../../../../constants/messages";
import {MusicCommands} from '../../../../constants/musicCommands';
import {PlayerService} from "../../../../services/music/PlayerService";
import {Client} from "discord.js";
import {InputType} from "../../../../types/InputType";
import {YoutubeService} from "../../../../services/music/youtube";
import {YouTubeVideo} from "play-dl";
import {limitString} from "../../../../utils/common";

export default {
    hasAutoComplete: true,
    data: new SlashCommandBuilder()
        .setName(MusicCommands.play.name)
        .setDescription(MusicCommands.play.description)
        .setDMPermission(false)
        .addStringOption(option => option.setName('input')
            .setDescription('Link to be played')
            .setRequired(true)
            .setAutocomplete(true)),
    async execute(interaction: any, client: Client) {
        let input = interaction.options.getString('input');
        if (input === null) {
            await interaction.followUp(messages.error);
            return;
        }
        let player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            player = await PlayerService.createPlayer(interaction, client);
        }
        const username = interaction.member?.user.username || '';
        const linkType = await PlayerService.classify(input);
        try {
            await PlayerService.enterReadyState(player);
        }catch (e) {
            await interaction.followUp(messages.joinVoiceChannel);
            console.log('cannot enter ready state')
            return;
        }
        try {
            await PlayerService.process(
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
    },
    async autocomplete(interaction: any, client: Client) {
        try {
            const input = interaction.options.getString('input');
            const results = await YoutubeService.search(input);
            await interaction.respond(
                results.map((choice: YouTubeVideo) => ({
                    name: limitString(choice.title as string, 80) + ' | ' + limitString(choice.durationRaw, 10),
                    value: choice.url })),
            );
        } catch (e) {
            await interaction.respond([
                {
                    name: 'Không tìm thấy kết quả',
                    value: ''
                }
            ]);
        }
    }
}




