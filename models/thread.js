import mongoose, { Schema, model } from "mongoose";


//not any role apart from being part of thread so created in same file

const messageSchema=new Schema({
    role:{
        type:String,
        enum:["user","model"],
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }
})

const threadSchema = new Schema({
    threadId:{
        type:String,
        required:true,
        unique:true,
    },
     userId: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Added
    ref: "User",
    required: false, // guest chats ke liye
  },

    title:{
        type:String,
        default:"New Chat"

    },
    messages:[messageSchema],
    createdAt:{
        type:Date,
        default:Date.now,

    },
    updatedAt:{
        type:Date,
        default:Date.now,

    }



})

const Thread = model("Thread",threadSchema);
export default Thread;
