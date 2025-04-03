import mongoose from 'mongoose'

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb has connected ${conn.connection.host}`);

    } catch (error) {
        console.log(`Error connecting to MongoDb, ${error}`);
        process.exit(1)
    }
}