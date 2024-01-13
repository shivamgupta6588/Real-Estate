import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const _dirname= path.resolve();

const app= express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongodb")
}).catch((err)=>
{
    console.log(err);   
});
app.use(express.json());
app.listen(3000,()=>{
    console.log("Server started!");
});
app.use(cookieParser());


app.use('/api/user', userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use(express.static(path.join(_dirname,'/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(_dirname,'client','dist','index.html'));
})

app.use((err,req,res,next)=>{
    const statuscode=err.statusCode||500;
    const message=err.message||'Internal Server Error';

    return res.status(statuscode).json({
        success:false,
        statuscode,
        message
    });
});