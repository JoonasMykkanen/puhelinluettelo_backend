const personsRouter = require('./controllers/persons')
const config = require('./utils/config')
const mw = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

mongoose.set('strictQuery', false)
morgan.token('postdata', function () { return mw.postToken() })
const format = ':method :url :status :res[content-length] - :response-time ms :postdata'

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB', error.message)
	})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(format))
app.use(mw.requestLogger)

app.use('/api/persons', personsRouter)

app.use(mw.unknownEndpoint)
app.use(mw.errorHandler)

module.exports = app