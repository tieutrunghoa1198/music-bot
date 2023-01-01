import {Client, Message} from "discord.js";
import {RestrictChannel} from "../../mongodb/restrict.model";

const restrict = async (msg: Message, client: Client) => {
    await RestrictChannel.findOne(
        {guildId: msg.guildId},
        async (er: any, guild: any) => {
            if (!guild) {
                // const channel = await client.channels.fetch(msg.channelId);
                //
                // await RestrictChannel.collection.insertOne({
                //     guildId: msg.guildId,
                //     guildName: 'String',
                //     restrictChannels: [
                //         {
                //             channelId: msg.channelId,
                //             // @ts-ignore
                //             channelName: channel?.name,
                //             roleId: 'String',
                //             roleName: 'String'
                //         }
                //     ],
                // })
            } else {
                // const channel = client.channels.fetch(msg.channelId);
                // const user = client.users.fetch(msg.author.id);

                let selectedChannel;
                await guild.restrictChannels.forEach((element: any) => {
                    if (element.channelId.toString() === msg.channelId.toString()) {
                        selectedChannel = element
                        return;
                    }
                })
                // @ts-ignore
                const role = await msg.member?.roles.cache.get(selectedChannel?.roleId);
                console.log(selectedChannel);
                console.log(msg.deletable, 'msg');
                // @ts-ignore
                console.log(selectedChannel?.roleId)

                if (msg.deletable && !role) {
                    await msg.delete().catch(error => {
                        // Only log the error if it is not an Unknown Message error
                        if (error) {
                            console.error('Failed to delete the message:', error);
                            return;
                        }
                    });
                    console.log(msg.deletable, '[INFO] Status after msg was deleted');
                }

            }
    }).clone();
}
export default {
    restrict
}
