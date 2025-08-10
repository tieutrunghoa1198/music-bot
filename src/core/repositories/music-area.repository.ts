import { Model } from 'mongoose';
import { MusicAreas } from '@/core/mongodb/music-area.model';

export interface MusicAreaDocument {
  guildId: string;
  guildName: string;
  textChannelId: string;
}

export class MusicAreaRepository {
  constructor(private readonly model: Model<any> = MusicAreas) {}

  async findByGuildId(guildId: string) {
    try {
      return await this.model.findOne({ guildId }).exec();
    } catch (error) {
      console.error('Cannot find at MusicAreaRepository.findByGuildId', error);
      return null;
    }
  }

  async findByTextChannelId(textChannelId: string) {
    try {
      return await this.model.findOne({ textChannelId }).exec();
    } catch (error) {
      console.error('Cannot find at MusicAreaRepository.findByTextChannelId', error);
      return null;
    }
  }

  async insert(doc: MusicAreaDocument) {
    try {
      return await this.model.collection.insertOne(doc);
    } catch (error) {
      console.error('Cannot insert at MusicAreaRepository.insert', error);
      return null;
    }
  }

  async updateTextChannelId(guildId: string, textChannelId: string) {
    try {
      return await this.model.collection.updateOne(
        { guildId },
        { $set: { textChannelId } },
      );
    } catch (error) {
      console.error('Cannot update at MusicAreaRepository.updateTextChannelId', error);
      return null;
    }
  }
}
