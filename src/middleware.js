const morgan = require('morgan')

const postToken = () => {
	morgan.token('postdata', function (req, res) {
		if (req.method === 'POST') {
			return JSON.stringify(req.body)
		} else {
			return ''
		}
	})
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({error: 'malformatted id'})
	} else if (error.name === 'ValidationError') {
		return res.status(400).send({error: 'invalid input'})
	} else if (error.name === 'DuplicateKeyError') {
		return res.status(409).send({error: 'duplicate key'})
	} else if (error.name === 'DocumentNotFoundError') {
		return res.status(404).send({error: 'document not found'})
	}

	next(error)
}


const requestLogger = (req, res, next) => {
	req.timestamp = new Date().toLocaleString('en-US', {
		timeZone: 'Europe/Helsinki',
		timeZoneName: 'long',
		})
		next()
} 

const mw = {
	unknownEndpoint,
	requestLogger,
	errorHandler,
	postToken
}

module.exports = mw