import mongoose from "mongoose";

export const connectdb = async(req,res) => {
    try{
        await mongoose.connect(process.env.MANGODB_URL)
    }catch(err){
        console.log(err?.message);
    }
}