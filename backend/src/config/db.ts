import mongoose from "mongoose";


let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };

        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/admissions";

        if (!process.env.MONGO_URI && process.env.NODE_ENV === "production") {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

export default connectDB;
