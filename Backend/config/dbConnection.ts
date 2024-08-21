import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectToDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || '';
    if (!uri) {
      throw new Error("MongoDB connection URI is not defined in the environment variables.");
    }

    const { connection } = await mongoose.connect(uri);
    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDB;
