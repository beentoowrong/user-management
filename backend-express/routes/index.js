const express = require('express')

const router = express.Router();

const verifyToken = require('../middleware/auth')

const { validateCreateUser, validateUpdateUser } = require('../utils/validator/user')

const registerController = require('../controllers/register-controller')
const loginController = require('../controllers/login-controller')
const userController = require('../controllers/user-controller')

const { validateRegister, validateLogin } = require('../utils/validator/auth')

router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login)
router.get('/admin/user', verifyToken, userController.findUser)
router.post('/admin/user', verifyToken, validateCreateUser, userController.createUser)
router.get('/admin/user/:id', verifyToken, userController.findUserById)
router.put('/admin/user/:id', verifyToken, validateUpdateUser, userController.updateUser)
router.delete('/admin/user/:id', verifyToken, userController.deleteUser )

module.exports = router