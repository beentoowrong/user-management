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
router.get('/admin/users', verifyToken, userController.findUser)
router.post('/admin/users', verifyToken, validateCreateUser, userController.createUser)
router.get('/admin/users/:id', verifyToken, userController.findUserById)
router.put('/admin/users/:id', verifyToken, validateUpdateUser, userController.updateUser)
router.delete('/admin/users/:id', verifyToken, userController.deleteUser )

module.exports = router