import express from 'express';
import { test } from '../controllers/user.controller';

const router=express.Router();

app.get('/test',test);

export default router;