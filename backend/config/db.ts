import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Db connected");
  } catch (err) {
    console.log("Db connection error", err);
    throw err;
  }
};

export default connectDb;
