import {BuilderID} from "../../../constants";
import {Client} from "discord.js";
import clearQueueCommand from "../../command/music/clearQueue.command";

export default {
    customId: BuilderID.clearQueue,
    execute: async (interaction: any, client: Client) =>
        clearQueueCommand.execute(interaction, client)
}
