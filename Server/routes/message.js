const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const messageController = require('../controllers/messageController')

const auth = require('../middlewares/auth')

router.post('/', auth, catchErrors(messageController.getMessagesByChatroom))
// router.post('/', auth, catchErrors(messageController.createChatroom))

module.exports = router