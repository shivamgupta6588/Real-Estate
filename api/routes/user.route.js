import express from 'express';
import { test ,updateUser,deleteUser,getUserListing,getListing,checkUserEmail,checkUserName} from '../controllers/user.controller.js';
import{verifyToken} from '../utils/verifyUser.js';

const router=express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyToken,getUserListing);
router.get('/:id',verifyToken,getListing);
router.get('/update/checkusername/:username',verifyToken,checkUserName);
router.get('/update/checkuseremail/:email',verifyToken,checkUserEmail);



export default router;