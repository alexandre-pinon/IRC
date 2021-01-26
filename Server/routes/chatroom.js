const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const chatroomController = require('../controllers/chatroomController')

const auth = require('../middlewares/auth')

router.get('/list', auth, catchErrors(chatroomController.getAllChatrooms))
router.get('/:userId', auth, catchErrors(chatroomController.getChatroomsByUser))
router.post('/create', auth, catchErrors(chatroomController.createChatroom))
router.post('/list', auth, catchErrors(chatroomController.getChatroomsByString))
router.put('/join', auth, catchErrors(chatroomController.addUserToChatroom))
router.put('/quit', auth, catchErrors(
    chatroomController.deleteUserFromChatroom
))
router.delete('/delete', auth, catchErrors(chatroomController.deleteChatroom))

module.exports = router