import mongoose, {Schema} from "mongoose";

const MusicAreaModel = new Schema({
    guildId: String,
    guildName: String,
    textChannelId: String,
})
export const MusicAreas = mongoose.model('musicAreas', MusicAreaModel)
