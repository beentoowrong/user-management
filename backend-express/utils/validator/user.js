const { body } = require('express-validator')

const prisma = require('../../prisma/client')

const validateCreateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid').custom(async (value, {req}) => {
        if (!value) {
            throw new Error('Email is required');
        }
        const user = await prisma.user.findUnique({ where: {email: value} })
        if(user && user.id !== Number(req.params.id)) {
            throw new Error('Email already exists')
        }

        return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

const validateUpdateUser = [
    body('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required'),

    body('email')
    .optional()
    .notEmpty()
    .withMessage('Email is required')
    .bail() // digunakan untuk menghentikan proses validasi yang gagal jika terdapat banyak error ganda
    .isEmail()
    .withMessage('Email is invalid')
    .bail() // digunakan untuk menghentikan proses validasi yang gagal jika terdapat banyak error ganda
    .custom(async (value, {req}) => {
        if (!value) {
            throw new Error('Email is required');
        }
        const user = await prisma.user.findUnique({ where: {email: value} })
        if(user && user.id !== Number(req.params.id)) {
            throw new Error('Email already exists')
        }

        return true;
    }),

    body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
]

module.exports = { validateCreateUser, validateUpdateUser }