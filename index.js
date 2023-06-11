const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
