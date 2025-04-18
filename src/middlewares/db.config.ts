import Tribute from "@/model/Tribute.model";
import User from "@/model/User.model";
import mongoose from "mongoose";

// Database Connection

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to the Database");
    });
    connection.on("error", (error) => {
      console.log("Error: ", error);
    });
    User;
    Tribute;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export default dbConfig;
