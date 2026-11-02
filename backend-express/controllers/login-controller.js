const express = require('express')

const { validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const prisma = require('../prisma/client')

const login = async(req, res) => {
    const error = validationResult(req)

    if(!error.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        })
    }

    try {
        const user = await prisma.user.findFirst({
            where : { email: req.body.email },
            select : {
                id : true,
                name : true,
                email: true,
                password: true,
            }
        })

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })

        // Destructure to remove password from user object
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            status: true,
            message: 'Login successfully',
            data: {
                user: userWithoutPassword,
                token: token,
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
};

module.exports = { login };