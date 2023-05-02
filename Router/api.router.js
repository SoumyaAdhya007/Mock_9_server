const express=require("express");
require("dotenv").config();
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const {UserModel}= require("../Models/user.model")
const {PostModel}= require("../Models/post.model")
const APIRouter= express.Router()

APIRouter.post("/register", async(req,res)=>{
    const {name,email,password,dob,bio}= req.body;
    try {
        if(!name||!email||!password||!dob||!bio){
         return   res.status(400).send({msg:"Please Provide All Details"})
        }
        const user= await UserModel.findOne({email});
        if(user){
            return res.status(400).send({msg:"User is Already Registerd"});
        }
        bcrypt.hash(password, +process.env.soltRounds,  async(err,hash_pass)=>{
            try {
                if(err){
                  return  res.status(400).send({msg:err})
                }
                const new_user= new UserModel({
                    name,
                    email,
                    password:hash_pass,
                    dob,
                    bio,
                    posts:[],
                    friends:[],
                    friendRequests:[]
                })
                await new_user.save();
                res.status(201).send({msg:"User Register"})
            } catch (error) {
               return res.status(404).send({msg:error})

            }
        })

    } catch (error) {
        res.status(404).send({msg:error})
    }
})
APIRouter.get("/users", async(req,res)=>{
    try {
        const users= await UserModel.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})
APIRouter.post("/users/:id/friends", async(req,res)=>{
    const id= req.params.id;
    const {userId}=req.body;
    try {
        if( !id){
          return  res.status(400).send({msg:"You Have to give Your Friend Id in params to Send Frined Request"})
        }
        if(!userId){
          return  res.status(400).send({msg:"You have to give Your Id in Body as userId To Send Frined Request"})
        }
        const findUser= await UserModel.findOne({_id:id});
        if(!findUser){
           return res.status(400).send({msg:"user Not Found"})
        }
        if(findUser.friendRequests.includes(userId)){
            return res.status(400).send({msg:"You already send Friend request"})
        }
        if(findUser.friends.includes(userId)){
            return res.status(400).send({msg:"You both are already frineds"})
        }
        await UserModel.findOneAndUpdate(
            {_id:id},
            {
                $push:{
                    friendRequests:userId
                }
            }
            )
        res.status(201).send({msg:`Send Friend Request To ${findUser.name}`})
        
    } catch (error) {
        res.status(404).send({msg:error})
    }
} )
APIRouter.patch("/users/:id/friends/:friendId", async(req,res)=>{
    const id= req.params.id;
    const frinedID= req.params.friendId;
    const {status}=req.body;
    try {
        const findUser= await UserModel.findOne({_id:id});
        if(!findUser){
            return res.status(400).send({msg:"User Not Found"})
        }
        if(!findUser.friendRequests.includes(frinedID)){
            return res.status(400).send({msg:"Friend Request Not Found"})
        }
        if(status===true || status===false){
        if(status){
            await UserModel.findOneAndUpdate(
                {_id:id},
                {
                    $pull:{
                        friendRequests:frinedID
                    }
                }
                )
            await UserModel.findOneAndUpdate(
                {_id:id},
                {
                    $push:{
                        friends:frinedID
                    }
                }
                )
           return res.status(204).send({msg:"Friend Request accepted"})

            }else{
                await UserModel.findOneAndUpdate(
                    {_id:id},
                    {
                        $pull:{
                            friendRequests:frinedID
                        }
                    }
                    )
          return  res.status(204).send({msg:"Friend Request rejected "})
                
            }
        }else{
            return res.status(400).send({msg:`status should be Boolean true or false. True means accept  and false means reject.`})

        }
        
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})
APIRouter.get("/posts", async(req,res)=>{
    try {
        const posts= await PostModel.find();
        res.status(200).send(posts)
    } catch (error) {
        res.status(404).send({msg:error})
    }
})
APIRouter.get("/posts/:id", async(req,res)=>{
    const id=req.params.id;
    try {
        
        const posts= await PostModel.findOne({_id:id});
        if(!posts){
            return res.status(400).send({msg:"Post Not Found"})
        }
        res.status(200).send(posts)
    } catch (error) {
        res.status(404).send({msg:error})
    }
})

APIRouter.post("/posts", async(req,res)=>{
    const paload=req.body;
    try {
        if(!paload.user|| !paload.text||!paload.image){
            return res.status(400).send({msg:"Plase give All Details"})
        }
        const finduser= await UserModel.findOne({_id:paload.user});
        if(!finduser){
            return res.status(400).send({msg:"User Not Found"})
        }
        const newPost= new PostModel({
            user:paload.user,
            text:paload.text,
            image:paload.image,
            createdAt: new Date(),
            likes:[],
            comments:[]
        })
        await newPost.save();

       let post= await PostModel.findOne({user:paload.user});
       await UserModel.findOneAndUpdate(
        {_id:paload.user},
        {
            $push:{
                posts:post._id
            }
        }
        )
        return res.status(201).send("User Posted")
    } catch (error) {
        res.status(404).send({msg:error})
    }
})
APIRouter.patch("/posts/:id",  async(req,res)=>{
    const id= req.params.id;
    const payload= req.body;
    
    try {
        if(payload.text && payload.image){
            await PostModel.findByIdAndUpdate({_id:id},{text:payload.text},{image:payload.image});
            return res.status(204).send({msg:"Post Updated"})
        }
        if(payload.text){
            await PostModel.findByIdAndUpdate({_id:id},{text:payload.text});
            return res.status(204).send({msg:"Post Updated"})
        }
        if(payload.image){
            await PostModel.findByIdAndUpdate({_id:id},{image:payload.image});
            return res.status(204).send({msg:"Post Updated"})
        }
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})

APIRouter.delete("/posts/:id", async(req,res)=>{
    const id= req.params.id;
    try {
        const findPost= await PostModel.findOne({_id:id})
        if(!findPost){
            return res.status(400).send({msg:"Post Not Found"})
        }
        await UserModel.findOneAndUpdate(
            {_id:findPost.user},
            {
                $pull:{
                    posts:id
                }
            }
            )
        await PostModel.findByIdAndRemove({_id:id});
        return res.status(202).send({msg:"Post Deleted"})
    } catch (error) {
        res.status(404).send({msg:error})
        
    }
})
module.exports={
    APIRouter
}