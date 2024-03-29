import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from'jsonwebtoken';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';
dotenv.config();

export const test = (req, res) => {
    res.json({
        message: 'hello world',
    });
};

export const checkUserEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { userId } = req.query; // Assuming you pass the current userId as a query parameter
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    res.json({ exists: !!existingUser });
  } catch (error) {
    next(error); // Forward the error to the error handler
  }
};

export const checkUserName = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { userId } = req.query; // Assuming you pass the current userId as a query parameter
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });

    res.json({ exists: !!existingUser });
  } catch (error) {
    next(error); // Forward the error to the error handler
  }
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"));
  
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          }
        },
        { new: true }
      );
  
      const { password, ...userDetails } = updateUser._doc;
      res.status(200).json(userDetails);
    } catch (error) {
      next(error);
    }
  };



  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"));
  
    try {
    await User.findByIdAndDelete(req.params.id);   
    res.clearCookie('access_token')
    res.status(200).json('User has been deleted');
    } catch (error) {
      next(error);
    }
  };
  
  export const getUserListing=async(req,res,next)=>{
    
    if(req.user.id ===req.params.id){
      try {
        const listings=await Listing.find({userRef:req.params.id});
        res.status(200).json(listings);
      }catch (error){
      
    }}  
    else{
      return next(errorHandler(401,'You can only view your listings'));      

    }
  }

  export const getListing= async(req, res, next)=>{
    try {
      const listing=await User.findById(req.params.id);
      if(!listing)
        next(errorHandler(404,'User not found'));
      const {password:pass,...rest}=listing._doc;
      // console.log(rest);
      res.status(200).json(rest);
    } catch (error) {
      next(error);
      
}
    

  }
