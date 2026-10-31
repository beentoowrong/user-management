const express = require('express')

const router = express.Router();

const verifyToken = require('../middleware/auth')

const { validateUser } = require('../utils/validator/user')

const registerController = require('../controllers/register-controller')
const loginController = require('../controllers/login-controller')
const userController = require('../controllers/user-controller')

const { validateRegister, validateLogin } = require('../utils/validator/auth')

router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login)
router.get('/admin/user', verifyToken, userController.findUser)
router.post('/admin/user', verifyToken, validateUser, userController.createUser )
router.get('/admin/user/:id', verifyToken, userController.findUserById)

module.exports = router