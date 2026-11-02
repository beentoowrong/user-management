const express = require("express")

const prisma = require('../prisma/client')

const { validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')

const findUser = async (req, res) => {
    try {

        // get all users from database
        const users = await prisma.user.findMany({
            select:{
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            success: true,
            message: 'Get all users successfully',
            data: users
        })
    }
    catch (error) {
        res.status(500).send({
            succes: false,
            message: 'Internal server error'
        })
    }
};


const createUser = async (req, res) => {
    // Periksa hasil validasi, inputan yang dikirim oleh user, kalau di nest kayak dto dan validation pipe
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'validation error',
            errors: errors.array(),
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        })
        res.status(201).send({
            success: true,
            message: 'Register successfully',
            data: user,
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

const findUserById = async (req, res) => {

    // get ID from param
    const { id } = req.params;

    try {
        // get user by id
        const user = await prisma.user.findUnique({
            where: { id: Number(id)},
            select: { id: true, name: true, email: true }
        })

        res.status(200).send({
            success: true,
            message: `Get by User by Id : ${id}`,
            data: user,
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

const updateUser = async (req, res) => {
    
    const { id } = req.params;

    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "validation error",
            errors: error.array()
        })
    }

    try {

        const user = await prisma.user.findUnique({
            where: { id: Number(id)},
            select: { id: true, name: true, email: true }
        })

        if(!user) {
            return res.status(404).json({
                succes: false,
                message: `User by Id : ${id} is not found` 
            })
        }

        const updateData = {}
        
        if (req.body.name !== undefined) {
            updateData.name = req.body.name
        }

        if (req.body.email !== undefined) {
            updateData.email = req.body.email
        }

        if (req.body.password !== undefined) {
            updateData.password = await bcrypt.hash(req.body.password, 10)
        }

        const update = await prisma.user.update({
            where: {id: Number(id)},
            data: updateData,
            select : {
                id: true,
                name: true,
                email: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: update
        })
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "Internal server error"
        })
    }
}

const deleteUser = async (req, res) => {
    
    const { id } = req.params

    try {

        const user = await prisma.user.findUnique({
            where: { id: Number(id)},
        })

        if(!user) {
            return res.status(404).json({
                succes: false,
                message: `User by Id : ${id} is not found` 
            })
        }

        const deleteUser = await prisma.user.delete({
            where: { id: Number(id) },
            select : {
                id: true,
                name: true,
                email: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deleteUser
        })

    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "Internal server error"
        })
    }
}

module.exports = { findUser, createUser, findUserById, updateUser, deleteUser}