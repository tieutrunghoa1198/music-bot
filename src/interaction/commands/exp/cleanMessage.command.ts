import { SlashCommandBuilder } from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {Command} from "../../../constants/command";
import {Client, Message, TextChannel} from "discord.js";
import {text} from "express";
import {MessageType} from "discord-api-types/v9";
import {CommonConstants} from "../../../constants/common";

export default {
    data: new SlashCommandBuilder()
        .setName(Command.cleanMessage.name)
        .setDescription(Command.cleanMessage.description),
    execute: async function (interaction: any, client: Client) {
        await interaction.deferReply();

        const textChannelId = interaction.channelId;
        const textChannel: TextChannel = client.channels.cache.get(textChannelId) as TextChannel;

        const recentMessages = await textChannel.messages.fetch({limit: 90});
        if (!recentMessages) {
            console.log('cannot get recent messages');
            return;
        }
        recentMessages.forEach((message: any) => {
            if (message === null || message === undefined) {
                console.log('asdasd')
                return;
            }
            if (message.author.bot && message.deletable) {
                const currentDate = Date.now();
                const twoHoursInMsc = 1000 * 60 * 60 * 2;
                if (currentDate - twoHoursInMsc < message.createdTimestamp) {
                    message.delete().catch((err: any) => {
                        console.log('[ERROR] clean unknown msg' + err)
                        return;
                    })
                }
            }
        })
    }
}

const deleteMessage = async (recentMsg: any, callBackFn: Function) => {

    await callBackFn();
}
