const { body } = require('express-validator')

const prisma = require('../../prisma/client')

const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Email is invalid')
        .bail()
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { email: value } })
            if (user) {
                throw new Error('Email already exists')
            }
            return true
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

module.exports = { validateRegister, validateLogin }