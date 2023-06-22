import { List, PersonForm, FilterForm } from './components/Phonebook.js'
import Notification from './components/Notification.js'
import pbService from './services/persons.js'
import { useState, useEffect } from 'react'

const App = () => {
	const [persons, setPersons] = useState(null)
  	const [newName, setNewName] = useState('')
  	const [newNumber, setNumber] = useState('')
  	const [filter, setFilter] = useState('')

	const [errorMessage, setErrorMessage] = useState(null)
	const [successMessage, setSuccessMessage] = useState(null)

  	const nameChange = (event) => setNewName(event.target.value)
  	const numberChange = (event) => setNumber(event.target.value)
  	const updateFilter = (event) => setFilter(event.target.value)

	useEffect (() => {
		pbService.getAll().then(list => {setPersons(list)})
			.catch(error => {console.log('could not get list from server')})
	}, [])

	const updatePersonalInfo = (id) => {
		const person = persons[id]
		if (window.confirm(`${person.name} is already in phonebook, update number?`)) {
			console.log('user accepted update prompt')
			console.log(`updating ${id} aka ${person.name} ${newNumber} info`)
			const newObject = {name: person.name, number: newNumber}
			pbService.update(id, newObject)
				.then(updatedList => {
					const updatedPersons = [...persons]
					updatedPersons[id] = { ...updatedPersons[id], name: person.name, number: newNumber }
					setPersons(updatedPersons)
					console.log('updated number succesfully')
				})
				.catch(error => 
					{setErrorMessage(`${person.name} information has been deleted from server`)})
					pbService.getAll().then(list => {setPersons(list)})
						.catch(error => {console.log('could not get list from server')})
		} else {
			setErrorMessage('Cancelled..')
			console.log('user rejected update prompt')
		}
	}

	const  checkList = (name) => {
		const lowerName = name.toLowerCase()
		for (let i = 0; i < persons.length; i++) {
			const lowerPersonsName = persons[i].name.toLowerCase()
			if (lowerPersonsName === lowerName) {
				updatePersonalInfo(i)
				return (true)
			}
		}
		return (false)
	}

	const addButton = (event) => {
		event.preventDefault()
		const newItem = {name: newName, number: newNumber}
		if (checkList(newName) === false) {
			pbService
				.create(newItem)
				.then(updatedList => {
					setPersons([...persons, {name: newName, number: newNumber}])
					console.log('added new item to list')
					setSuccessMessage(`${newName} succesfully added to the phonebook!`)
				})
				.catch(error => {console.log('error with creating new person')})
		}
		setNewName('')
		setNumber('')
	}

	const deleteButton = (id) => {
		const person = persons.find((person) => person.id === id)
		const name = person.name
		if (window.confirm(`Are you sure to remove "${name}" from the phonebook?`)) {
			pbService
				.remove(id)
				.then(updatedList => {
					setPersons(persons.filter((person) => person.id !== id))
					console.log('removed from database and updated the view')
					setSuccessMessage(`${newName} removed from phonebook`)
				})
				.catch(error => {console.log('error removing person from the list')})
		} else {
			console.log('User cancelled delete')
			setErrorMessage('Cancelled..')
		}
	}
	if (!persons) {
		return null
	} else {
		return (
			<>
				<div>
					<h1>Phonebook</h1>
					<Notification 
						error={errorMessage}
						success={successMessage}
						setError={setErrorMessage}
						setSuccess={setSuccessMessage}/>
					<FilterForm
						filter={filter}
						updateFilter={updateFilter}/>
					<PersonForm 
						newName={newName}
						newNumber={newNumber}
						numberChange={numberChange}
						nameChange={nameChange}
						action={addButton}/>
					<List
						persons={persons}
						action={deleteButton}
						filter={filter}/>
				</div>
			</>
		)
	}
}

export default App