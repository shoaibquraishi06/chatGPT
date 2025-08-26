const express = require('express')

// auth routes
const authRoute = require('../src/Router/auth.routes')


const app = express()
app.use(express.json())

const authRoutes = require('./Router/auth.routes')


module.exports = app