import {logger} from "@/core/utils/logger.util";

require('dotenv').config();
const uri = process.env.uri;
const dbConnect = (mongoose: any) => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', (err: any) => {
      logger.error(err + '| dbConnect at mongodb.util');
    });
  } catch (e) {
    logger.error(e + '| dbConnect at mongodb.util');
  }
};

export default {
  dbConnect,
};
