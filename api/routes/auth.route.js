import express from 'express';
import {checkUseremail, checkUserName,google, signout, signup}  from '../controllers/auth.controller.js';
import {signin}  from '../controllers/auth.controller.js';

const router=express.Router();


router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signout);
router.get('/check-email/:email',checkUseremail);
router.get('/check-username/:username',checkUserName);


export default router;
