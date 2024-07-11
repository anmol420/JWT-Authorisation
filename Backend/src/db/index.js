import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`Database Connected At: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log("Database Error - ", err);
        process.exit(1);
    }
};

export default connectDB;