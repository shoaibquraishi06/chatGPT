const express = require('express');
const { route } = require('../app');
const authMiddleware = require('../middlewares/auth.middleware')
const chatController = require('../controller/chat.controller');




const router = express.Router();




router.post('/', authMiddleware.userAuth, chatController.createChat);

/* GET /api/chat/ */
router.get('/', authMiddleware.userAuth, chatController.getChats);

/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.userAuth, chatController.getMessages)


module.exports = router;