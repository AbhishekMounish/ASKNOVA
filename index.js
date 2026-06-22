import express, { json } from "express";
import "dotenv/config";
import cors from 'cors'
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/auth.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors(
    
));

app.use("/api",chatRoute);
app.use("/api",userRoute);

// app.post("/test",async(req,res)=>{
//     const options ={
//         method: "POST",
//         headers:{
//             "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
//             'Content-Type': "application/json"

//         },
//         body:  JSON.stringify({
//             "contents": [
//       {
//           "role": "user",
//           "parts": [
//                 {
//                     text: req.body.message
//                 }
//           ]
//       },
//     ]

//         }) 

//     }
//     try{
//         const model = "gemini-2.5-flash";

// const response = await fetch(
//   `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
//   options
// );

// const data = await response.json();
// console.log( data.candidates[0].content.parts[0].text);
// res.send(data.candidates[0].content.parts[0].text);



//     }catch(e){
//         console.log(e);
        

//     }
// })

const connection = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("####connected to Database####");
    }catch(e){
        console.log("failed to connect database:", e);
    }

} 

app.listen(PORT,()=>{
    console.log("+++++SERVER IS CONNECTED+++++")
    connection();
})