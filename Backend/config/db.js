import mongoose from'mongoose'

export const connectdb =async()=>{
    await mongoose.connect("mongodb+srv://Arnav_1234:125467896754@cluster0.qr9me.mongodb.net/foody").then(()=>console.log("DB connected"));
}