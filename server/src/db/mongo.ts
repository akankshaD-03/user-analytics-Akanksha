import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGO_URI!);

let dbInstance: any = null;

export const connectDB = async () => {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db();
    console.log("🟢 Connected to MongoDB");
  }
  return dbInstance;
};
