const validatePerson = (name, number, persons) => {
	if (!name) {
	  return { error: 'Name missing' }
	}
	if (!number) {
	  return { error: 'Number missing' }
	}
	const match = persons.find(match => match.name === name)
	if (match) {
	  return { error: 'Name must be unique' }
	}
	return null
  }
  
  module.exports = validatePerson