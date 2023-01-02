const express = require('express')
const { register, login, verifyEmail } = require('../controllers/userController')
const router = express.Router()

// USER ROUTES
router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/login', login)

module.exports = router