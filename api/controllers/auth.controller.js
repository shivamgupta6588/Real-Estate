import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup= async(req,res,next)=>{

   const {username,email,password}=req.body;
   const hasshedpassword=bcryptjs.hashSync(password,10);
   const newUser= new User({username,email,password:hasshedpassword});
    try{await newUser.save();

    res.status(201).json({ message: "User has been created!" })
    }catch(error)
    {
      next(error);
    }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      const error = new Error('User not found');
      error.status = 401;
      return next(error);
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      const error = new Error('Wrong password');
      error.status = 402;
      return next(error);
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({
        rest,
      });

  } catch (error) {
    next(error);
  }
};
