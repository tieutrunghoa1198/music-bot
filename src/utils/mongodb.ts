const uri = process.env.uri;

const dbConnect = (mongoose: any) => {
    mongoose.set('strictQuery', true);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', (err: any) => {
        console.log(err);
    });
};

export default {
    dbConnect
}
