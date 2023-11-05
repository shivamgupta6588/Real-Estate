import express from 'express';
import mongoose from 'mongoose';
import userRouter from '../api/routes/user.route.js';
import dotenv from 'dotenv';
dotenv.config();


const app= express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongodb")
}).catch((err)=>
{
    console.log(err);   
});

app.listen(3000,()=>{
    console.log("Server started!");
});


app.use('/api/user', userRouter);