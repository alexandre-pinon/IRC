const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const chatroomController = require('../controllers/chatroomController')

const auth = require('../middlewares/auth')

router.get('/:userId', auth, catchErrors(chatroomController.getChatroomsByUser))
router.put('/edit', auth, catchErrors(chatroomController.editChatroom))

module.exports = router