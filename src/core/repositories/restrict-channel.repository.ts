import { Model } from 'mongoose';
import { RestrictChannel } from '@/core/mongodb/restrict.model';

export interface RestrictChannelDocument {
  guildId: string;
  guildName: string;
  restrictChannels: Array<{
    channelId: string;
    channelName: string;
    roleId: string;
    roleName: string;
  }>;
}

export class RestrictChannelRepository {
  constructor(private readonly model: Model<any> = RestrictChannel) {}

  async findByGuildId(guildId: string) {
    try {
      return await this.model.findOne({ guildId }).exec();
    } catch (error) {
      console.error('Cannot find at RestrictChannelRepository.findByGuildId', error);
      return null;
    }
  }

  async insert(doc: RestrictChannelDocument) {
    try {
      return await this.model.collection.insertOne(doc);
    } catch (error) {
      console.error('Cannot insert at RestrictChannelRepository.insert', error);
      return null;
    }
  }

  async update(guildId: string, data: Partial<RestrictChannelDocument>) {
    try {
      return await this.model.collection.updateOne({ guildId }, { $set: data });
    } catch (error) {
      console.error('Cannot update at RestrictChannelRepository.update', error);
      return null;
    }
  }
}
