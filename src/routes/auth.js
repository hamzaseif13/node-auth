const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require('../config')
const UserModel = require("../model/User")
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        res.status(201).json({
            user: newUser,
            message: "Signup Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return res.status(400).json({ message: "incorrect password" })
        }
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, config.jwtSecret);
        delete user.password;
        return res.json({ token, user });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something Went Wrong" })
    }

});


module.exports = router;