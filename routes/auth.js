import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import auth from "../middleware/auth.js";


dotenv.config();

const userRouter = express.Router();

userRouter.post("/user/signup", async (req,res)=>{
    const { name,email,password}=req.body;
    console.log(req.body);
    try{
        const alreadyExist = await User.findOne({email});
        console.log("Found User:", alreadyExist);
        if(alreadyExist){
           return  res.status(400).json({
                message:"user already exist",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        const newuser= new User({
            name,
            email,
            password:hashedPassword
        })
        await newuser.save();
        console.log("User saved:", newuser);
        const token = jwt.sign({id:newuser._id},
            process.env.JWT_SECRECT,{
                expiresIn:"7d"
            })

            res.status(201).json({
                token,
                userId:newuser._id,
                 name: newuser.name

            })

    }catch(e){
           console.log("error",e.message);
         res.status(500).send("server error")

    }


})

userRouter.post("/user/signin" ,async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.findOne({email});
        console.log("Login found user:", user);
        if(!user){
            return res.status(400).json({
                message:"Invalid creaditials",
            })
        }

        const ismatch= await bcrypt.compare(password,user.password);
        if(!ismatch){
             return res.status(400).json({
                message:"Invalid creaditials",
            });
        }
        const token = jwt.sign({id:user._id},
            process.env.JWT_SECRECT,
            {expiresIn:"7d"}
        )
        res.status(201).json({
            token,
            userId:user._id,
             name: user.name
        })

    }catch(e){
         console.log("error",e.message);
         res.status(500).send("server error")

    }


})



userRouter.delete("/user/delete",auth, async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.user.id);
          res.status(200).json({
      message: "Account deleted successfully",
    });
       
    }catch(e){
          console.log("error",e.message);
         res.status(500).send("server error");

    }


})

export default userRouter
