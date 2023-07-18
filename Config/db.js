import mongoose from "mongoose";
import  Color  from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected To MongoDb Database ${conn.connection.host}`.bgGreen.black)
    } catch (error) {
        console.log(`Error in MongoDb ${error}`.bgRed.white)
    }
}

export default connectDB;