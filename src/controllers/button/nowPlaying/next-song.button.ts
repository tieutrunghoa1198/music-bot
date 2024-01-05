import {Client} from "discord.js";
import skipCommand from "../../command/music/skip.command";
import {BuilderID} from "@/constants/music-commands.constant";

export default {
    customId: BuilderID.nextSong,
    execute: async (interaction: any, client: Client) =>
        skipCommand.execute(interaction, client)
}
