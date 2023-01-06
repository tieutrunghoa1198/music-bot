const uri = process.env.uri;

const dbConnect = (mongoose: any) => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('error', (err: any) => {
            console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
};

export default {
    dbConnect
}
