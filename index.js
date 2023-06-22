const {unknownEndpoint, postToken} = require('./src/middleware')
const validatePerson = require('./src/validation')
const Person = require('./src/models/person')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()

// Morgan init to format post data to JSON
const postdata = postToken()
const format = ':method :url :status :res[content-length] - :response-time ms :postdata'

// Middleware
app.use(cors())
app.use(morgan(format))
app.use(express.json())
app.use(express.static('build'))
app.use((req, res, next) => {
	req.timestamp = new Date().toLocaleString('en-US', {
	  timeZone: 'Europe/Helsinki',
	  timeZoneName: 'long',
	})
	next()
})

app.get('/', (req, res) => { res.send('<p>puhelinluettelo backend</p>') })

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

app.get('/api/info', async (req, res) => {
	const persons = await Person.find({})
	if (persons === undefined) {
		return response.status(400).json({ error: 'error with db' })
	}
	const len = persons.length
	const time = req.timestamp	
	const response = `<p>Phonebook has info for ${len} people.</p><p>${time}</p>`
	res.send(response)
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(person => {
		res.json(person)
	})
})

app.delete('/api/persons/:id', async (req, res) => {
		const id = Number(req.params.id)
		const persons = await Person.find({})
		if (persons === undefined) {
			return response.status(400).json({ error: 'error with db' })
		}
		// functionality for deleting is not yet there
		res.status(204).end()
})

app.post('/api/persons', async (req, res) => {
	const persons = await Person.find({})
	if (persons === undefined) {
		return response.status(400).json({ error: 'error with db' })
	}
	const { name, number } = req.body
	const validationError = validatePerson(name, number, persons)
	if (validationError) {
		return res.status(400).json(validationError)
	}
	const id = Math.floor(Math.random() * 1000000)
	const newPerson = new Person ({
		id: id,
		name: name,
		number: number
	})
	newPerson.save().then(savedPerson => {
		res.json(savedPerson)
	})
})

// Handle error case if page does not exist
app.use(unknownEndpoint)

// Actual server stuff
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
