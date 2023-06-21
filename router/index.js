const express=require('express');
const router=express.Router();
const auth=require('./auth')
const chat=require('./chat')
router.use('/auth',auth)
router.use('/message',chat)
module.exports=router