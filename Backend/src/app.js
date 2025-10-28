const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// auth routes
const authRoutes = require('./Router/auth.routes');
const chatRoutes = require('./Router/chat.routes');

// using middleware
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// using routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


module.exports = app