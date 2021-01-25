const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')

const auth = require('../middlewares/auth')

router.post('/login', catchErrors(userController.login))
router.post('/register', catchErrors(userController.register))
router.put('/nick', auth, catchErrors(userController.changeName))

module.exports = router