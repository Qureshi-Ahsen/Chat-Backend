const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat');
const auth = require('../middleware/accessToken');
const imageMiddleware = require('../middleware/image');

router.post('/conversation', auth, chatController.createConversation);
router.post('/message', auth,imageMiddleware.uploadMiddleware, chatController.createChat);
router.post('/messages', auth,imageMiddleware.bulkUploadMiddleware, chatController.createChat);

router.post('/all', auth, chatController.getAllConversations);
router.post('/:id', chatController.getAllConversationById);

module.exports = router;
