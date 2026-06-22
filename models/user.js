import mongoose, { Schema } from "mongoose";
import { Mongoose,model } from "mongoose";

const userschema= new Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const User = model("User",userschema);
export default User;