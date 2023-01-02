const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./config/database')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();

// MIDDLEWARE
app.use(express.json())
app.use(cors())

// CONNECTION TO DATABASE
db()

app.get('/', (req, res) => {
    res.send('Hello World')
})

// ROUTES
app.use('/users', userRoutes)

app.listen(5000, () => {
    console.log('App listening on http://localhost:5000');
})