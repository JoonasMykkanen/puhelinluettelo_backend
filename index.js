const unknownEndpoint = require('./src/middleware')
const validatePerson = require('./src/validation')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use((req, res, next) => {
	req.timestamp = new Date().toLocaleString('en-US', {
	  timeZone: 'Europe/Helsinki',
	  timeZoneName: 'long',
	})
	next()
})

let persons = [
	{
	  id: 1,
	  name: "Arto Hellas",
	  number: "040-123456"
	},
	{
	  id: 2,
	  name: "Ada Lovelace",
	  number: "39-44-523123"
	},
	{
	  id: 3,
	  name: "Mary Poppendick",
	  number: "39-44-123233"
	}
]

app.get('/', (req, res) => {
	res.send('<p>puhelinluettelo backend</p>')
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/info', (req, res) => {
	const len = persons.length
	const time = req.timestamp	
	const response = `<p>Phonebook has info for ${len} people.</p><p>${time}</p>`
	res.send(response)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => {return person.id === id})
	if (person) {
		res.json(person)	
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
		const id = Number(req.params.id)
		persons = persons.filter(person => person.id !== id)
		res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const { name, number } = req.body
	const validationError = validatePerson(name, number, persons)
	if (validationError) {
		return res.status(400).json(validationError)
	}
	const id = Math.floor(Math.random() * 1000000)
	const person = {
		id: id,
		name: name,
		number: number
	}
	persons = persons.concat(person)
	res.json(person)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
