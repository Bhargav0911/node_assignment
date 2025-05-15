import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
let db: Db;

export async function connectToDatabase() {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log('Connected to MongoDB');
}

export function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}
