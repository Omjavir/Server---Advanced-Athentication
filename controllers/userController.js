const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// REGISTER CONTROLLER
exports.register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exist" })
        // Hashing the user's password
        const hashedPassword = await bcrypt.hash(password, 12)
        // Creating User in Database
        const result = await User.create({ name, email, password: hashedPassword })
        // Creating (Signing) the token for user
        const token = jwt.sign({ email: result.email, id: result._id }, 'OMJAVIR', { expiresIn: "1h" })

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: process.env.PASSWORD
            }
        });

        // console.log("User:", User);
        // console.log("Mail:", email);

        let mailDetails = {
            from: '2020ce19f@sigce.edu.in',
            to: email,
            subject: 'Test mail',
            html: `<h3>Verify your email.</h3>
           <a href="http://localhost:5000/users/verify-email?token=${token}"><h4>Click here...</h4></a>`
        };
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent successfully');
            }
        });
        res.status(200).json({ Success: true, message: "User registered successfully", user: result, token })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// VERIFY EMAIL CONTROLLER
exports.verifyEmail = async () => {
    try {

    } catch (error) {
        console.log(error);
    }
}

// LOGIN CONTROLLER
exports.login = async (req, res) => {
    const { email, password, role } = req.body //Coming from formData
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message: "Invalid credentials" })
        // Comparing the user password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })
        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'OMJAVIR', { expiresIn: "1h" })
        //Then send the token to the client/frontend
        res.status(200).json({ Success: true, message: "Login Successfull", user: existingUser, token, message: { role } })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error);
    }
}