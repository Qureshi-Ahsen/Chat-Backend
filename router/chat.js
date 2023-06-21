const express=require('express');
const router=express.Router();
const chatController=require('../controller/chat');
const auth=require('../middleware/accessToken');
const AudioMiddleware=require('../middleware/audio');
const videoMiddleware=require('../middleware/video')
const fileMiddleware=require('../middleware/file')


router.post('/conversation',auth,chatController.createConversation)
router.post('/audio',auth,AudioMiddleware.uploadAudioMiddleware,chatController.createChat)
router.post('/video',auth,videoMiddleware.uploadVideoMiddleware,chatController.createChat)
router.post('/file',auth,fileMiddleware.uploadFileMiddleware,chatController.createChat)
router.post('/image',auth,fileMiddleware.uploadFileMiddleware,chatController.createChat)
router.post('/all',auth,chatController.getAllConversations);
router.post('/:id',chatController.getAllConversationById);
module.exports=router