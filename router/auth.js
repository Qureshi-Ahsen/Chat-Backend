const express=require('express');
const router=express.Router();
const auth=require('../controller/auth');
const loginValidator=require('../middleware/login')
const registerValidator=require('../middleware/register')
const refreshMiddleware=require('../middleware/refreshToken')
const singleUpload=require('../middleware/profile')

router.post('/register',singleUpload.uploadMiddleware,registerValidator,auth.register)
router.post('/login',loginValidator,auth.login)
router.post('/me',refreshMiddleware,auth.refresh)

module.exports=router