import  express from "express"
import Thread from "../models/thread.js";
import getGeminiAIResponse from "../utils/GeminiAI.js";
import auth from "../middleware/auth.js"
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.post("/test",async(req,res)=>{
    try{
        const newthread = new Thread({
            "threadId": "123abc",
            "title": "test data",
            "messages": [
              {
                "role": "user",
                "content": "Hello"
              },
              {
                "role": "model",
                "content": "Hi! How can I help you?"
              }
            ]          

        })

        const response = await newthread.save();
        res.send(response)

    }catch(e){
        console.log(e);
        res.status(500).json({e: "failed to connect "})
    }
})

// to get all threads
router.get("/thread",auth,async (req,res)=>{
    try{
      const threads=  await Thread.find({
         userId: req.user.id,
      }).sort({updatedAt:-1});

      res.json(threads);


    }catch(err){
        console.log(err);
        res.status(500).json({err:"failed to fetch"});
        
    }

    
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    
    try{
       const thread =  await Thread.findOne({threadId});
       if(!thread){
        res.status(404).res({error:"Thread not found"});

       }
       res.json(thread.messages);

    }catch(err){
        console.log(err);
        res.status(500).json({err:"failed to fetch"});
        
    }

});
router.delete("/thread/:threadId",async(req,res)=>{
    let {threadId}= req.params;
    try{
        const deletedThread= await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error:"Thread was not found"});
        }

        res.status(200).json({sucess:"Thread deleted succesfully"})

         }catch(err){
        console.log(err);
        res.status(500).json({err:"failed to fetch"});

    }

})

router.post("/chats",optionalAuth,async(req,res)=>{
    let { threadId,messages}= req.body;
    if(!threadId||!messages){
        res.status(400).json({
            error: "missing required field"
        })
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            //create new  thread
             thread = new Thread({
               threadId,
               userId: req.user?req.user.id:null,
               title:messages,
               messages : [{
                role:"user",
                content:messages,
               }]

            })


        }else{
            thread.messages.push({
                 role:"user",
                content:messages,

            })
                
            }

          const modelReply=  await getGeminiAIResponse(messages);
          thread.messages.push({
             role:"model",
                content: modelReply || "No response",

          })
          thread.updatedAt= new Date();

    
   await thread.save();

          res.json({reply:modelReply,
            messages:thread.messages
          });
        

    }catch(err){
        console.log(err);
        res.status(500).json({err:"something went wrong"});

    }

})


export default router

