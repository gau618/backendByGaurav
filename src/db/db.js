import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
  try {
    console.log(`mongodb://localhost:27017/${DB_NAME}`);
    const connectionInstance = await mongoose.connect(
      `mongodb://localhost:27017/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! at \n ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR", error);
    process.exit(1);
  }
};

