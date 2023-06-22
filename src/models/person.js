// Init of mongoose --> MongoDB
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
console.log('Trying to connect to ', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
	.then(result => {
		console.log('Connected to MongoDB')
	}).catch((error) => {
		console.log('Error connecting to MongoDB: ', error.message)
	})
const personSchema = new mongoose.Schema({
	id: Number,
	name: String,
	number: String,
})
mongoose.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__V
	}
})

module.exports = mongoose.model('Person', personSchema)