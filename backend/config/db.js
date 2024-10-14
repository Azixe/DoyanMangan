import mongoose from "mongoose";

export const connectDB = async () => {
    (await mongoose.connect('mongodb+srv://DoyanMangan:001973@cluster0.gxuwm.mongodb.net/DoyanMangan')).isObjectIdOrHexString(()=>console.log("DB Connected"));
}