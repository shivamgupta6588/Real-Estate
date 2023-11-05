import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
export const signup= async(req,res)=>{

   const {username,email,password}=req.body;
   const hasshedpassword=bcryptjs.hashSync(password,10);
   const newUser= new User({username,email,password:hasshedpassword});
    try{await newUser.save();

    res.status(201).json("User has been created!")
    }catch(err)
    {
      res.status(500).json(err.message);
    }
   // console.log(req.body());
};