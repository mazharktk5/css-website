import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable in .env");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
    if (cached.conn) {
        // Check if connection is still alive
        if (cached.conn.connection.readyState === 1) {
            return cached.conn;
        }
        // Connection dropped, reset cache
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000,
            })
            .then((mongoose) => mongoose)
            .catch((err) => {
                // Reset cache on failure so next call retries
                cached.promise = null;
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}
