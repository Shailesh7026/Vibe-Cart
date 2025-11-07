import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const {
  MONGO_URI,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_NAME,
} = process.env;

const uri = DB_USER && DB_PASS
  ? `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
  : MONGO_URI;

export default async function connectDB() {
  try {
    if (!uri) throw new Error("MONGO_URI is not set in .env");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

