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

module.exports = {
	unknownEndpoint,
	postToken
}