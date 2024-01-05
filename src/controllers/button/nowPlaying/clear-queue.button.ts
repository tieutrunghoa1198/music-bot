import {BuilderID} from "@/core/constants/music-commands.constant";
import {Client} from "discord.js";
import clearQueueCommand from "../../command/music/clear-queue.command";

export default {
    customId: BuilderID.clearQueue,
    execute: async (interaction: any, client: Client) =>
        clearQueueCommand.execute(interaction, client)
}
