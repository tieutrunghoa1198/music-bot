import {SlashCommandBuilder} from "@discordjs/builders";
import {Player, players} from "../../models/player";
import messages from "../../constants/messages";
import {generateButton, paginationMsg} from "./embedMessages/queue.embed";
import {entersState, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('checking player status'),
    async execute(interaction: any) {
        console.log(interaction);
    }
}
