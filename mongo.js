const mongoose = require('mongoose')
require('dotenv').config()

console.log('Trying to connect to ', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)