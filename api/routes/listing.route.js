import express from 'express';
import{verifyToken} from '../utils/verifyUser.js';
import {deleteListing, listing}  from '../controllers/listing.controller.js';

const router=express.Router();

router.post('/create',verifyToken,listing);
router.delete('/:id',verifyToken,deleteListing);


export default router;
