const validatePerson = require('./src/validation')
const Person = require('./src/models/person')
const mw = require('./src/middleware')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// Morgan init to format post data to JSON
const postdata = mw.postToken()
const format = ':method :url :status :res[content-length] - :response-time ms :postdata'

// Middleware
// some functions were moved to middleware.js to keep index.js clean
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(format))
app.use(mw.requestLogger)

app.get('/', (req, res) => { res.send('<p>puhelinluettelo backend</p>') })

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
	.catch(error => next(error))
})

app.get('/api/info', async (req, res) => {
	const persons = await Person.find({})
	if (persons === undefined) {
		return response.status(400).json({error: 'error with db'})
	}
	const len = persons.length
	const time = req.timestamp	
	const response = `<p>Phonebook has info for ${len} people.</p><p>${time}</p>`
	res.send(response)
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(person => {
		if (person) {
			res.json(person)
		} else {
			response.status(404).end()
		}
	})
	.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(person => {
			if (person) {
				res.status(204).end()
			} else {
				res.status(404).send({error: 'person not found'})
			}
		})
		.catch(error => next(error))
})

app.post('/api/persons', async (req, res) => {
	const persons = await Person.find({})
	if (persons === undefined) {
		return response.status(400).json({error: 'error with db'})
	}
	const { name, number } = req.body
	const validationError = validatePerson(name, number, persons)
	if (validationError) {
		return res.status(400).json(validationError)
	}
	const newPerson = new Person ({
		id: req.params.id,
		name: name,
		number: number
	})
	newPerson.save().then(savedPerson => {
		res.json(savedPerson)
	})
	.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const {name, number} = req.body
	Person.findByIdAndUpdate(
		req.params.id,
		{name, number}, 
		{new: true, runValidators: true, contex: 'query'})
			.then(updatedPerson => {
				res.json(updatedPerson)
			})
			.catch(error => next(error))
})

// Error handling
app.use(mw.unknownEndpoint)
app.use(mw.errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
