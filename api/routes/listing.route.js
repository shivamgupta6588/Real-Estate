import express from 'express';

import {listing}  from '../controllers/listing.controller.js';

const router=express.Router();

router.post('/create',listing);


export default router;
