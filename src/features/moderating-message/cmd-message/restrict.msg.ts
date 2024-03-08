import { Message } from 'discord.js';
import { RestrictChannel } from '@/core/mongodb/restrict.model';

const restrict = async (msg: Message) => {
  const query = RestrictChannel.where({ guildId: msg.guildId });
  const guild = await query.findOne();
  if (!guild) return;
  let selectedChannel: any;
  guild.restrictChannels.forEach((element: any) => {
    if (element.channelId.toString() === msg.channelId.toString()) {
      selectedChannel = element;
      return;
    }
  });

  const role = msg.member?.roles.cache.get(selectedChannel?.roleId);

  if (msg.deletable && !role && selectedChannel?.channelId) {
    await msg.delete().catch((error) => {
      // Only log the error if it is not an Unknown Message error
      if (error) {
        console.error('Failed to delete the message:', error);
        return;
      }
    });
  }
};
export default {
  restrict,
};

/**
 * test DB
 * "guildId": "325650252386271238",
 *   "guildName": "AKG",
 *   "restrictChannels": [
 *     {
 *       "channelId": "325650252386271238",
 *       "channelName": "xam-loz",
 *       "roleId": "1010780985245311028",
 *       "roleName": "Kenh Chat"
 *     },
 *     {
 *       "channelId": "878130330068996097",
 *       "channelName": "mu-sic-que",
 *       "roleId": "682233159215349773",
 *       "roleName": "Bot"
 *     }
 *   ]
 */
