// Init of mongoose --> MongoDB
const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
	id: String,
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		validate: {
			validator: validate => /^(?:\d{2,3}-\d{4,})$/.test(validate),
			message: props => `${props.value} incorrect phonenumber!`
		},
		required: true,
	}
})
personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)