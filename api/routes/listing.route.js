import express from 'express';
import{verifyToken} from '../utils/verifyUser.js';
import {listing}  from '../controllers/listing.controller.js';

const router=express.Router();

router.post('/create',verifyToken,listing);


export default router;
