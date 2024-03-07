import mongoose, { Schema } from 'mongoose';

const RestrictChannelModel = new Schema({
  guildId: String,
  guildName: String,
  restrictChannels: [
    {
      channelId: String,
      channelName: String,
      roleId: String,
      roleName: String,
    },
  ],
});
export const RestrictChannel = mongoose.model(
  'restrictChannel',
  RestrictChannelModel,
);
