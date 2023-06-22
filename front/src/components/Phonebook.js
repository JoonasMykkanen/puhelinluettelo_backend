const FilterForm =  ( {filter, updateFilter} ) => {
	return (
		<>
			<div>
				filter shown with: <input
				type="text"
				value={filter}
				onChange={updateFilter}
				/>
			</div>
		</>
	)
}

const PersonForm = ( {newName, newNumber, numberChange, nameChange, action} ) => {
	return (
		<>
			<h2>add a new</h2>
			<form onSubmit={action}>
				<div>
					name: <input 
					type="text"
					value={newName}
					onChange={nameChange}
					/>
					</div>
				<div>
					number: <input 
					type="text"
					value={newNumber}
					onChange={numberChange}
					/>
				</div>
				<div>
					<button type='submit'>add</button>
				</div>
			</form>
		</>
	)
}

const Item = ( {person, action} ) => {
	return (
		<>
			<span>
				{person.name} {person.number}{' '}
				<button
					type='button'
					onClick={action}>
					delete
				</button>
			</span>
		</>
	)
}

const List = ( {persons, filter, action} ) => {
	const trimmed = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
	const deleteItem = (id) => { action(id) }
	return (
		<>
			<h2>Numbers</h2>
			<ul>
				{trimmed.map((person, id) => (
				<li className='person' key={id}>
					<Item 
					person={person}
					action={() => deleteItem(person.id)}/>
				</li>
				))}
			</ul>
		</>
	)
 }

export { List, PersonForm, FilterForm }