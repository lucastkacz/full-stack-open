import { useEffect, useState } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import ErrorMessage from "./components/Error";
import personService from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [search, setSearch] = useState("");
	const [notification, setNotification] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		personService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();
		const existingPerson = persons.find((person) => person.name === newName);

		if (existingPerson) {
			const confirmUpdate = window.confirm(
				`${newName} is already added to phonebook, replace the old number with a new one?`
			);
			if (confirmUpdate) {
				const updatedPerson = { ...existingPerson, number: newNumber };
				personService
					.update(existingPerson.id, updatedPerson)
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) => (person.id !== existingPerson.id ? person : returnedPerson))
						);
						setNewName("");
						setNewNumber("");
					})
					.catch((error) => {
						setError(`Update failed: ${error.response.data.error}`);
						setTimeout(() => {
							setError(null);
						}, 5000);
					});
			}
		} else {
			const personObject = {
				name: newName,
				number: newNumber,
			};
			personService
				.create(personObject)
				.then((returnedPerson) => {
					setPersons(persons.concat(returnedPerson));
					setNewName("");
					setNewNumber("");
					setNotification(`Added ${returnedPerson.name}`);
					setTimeout(() => {
						setNotification(null);
					}, 5000);
				})
				.catch((error) => {
					setError(error.response.data.error);
					setTimeout(() => {
						setError(null);
					}, 5000);
				});
		}
	};

	const deletePerson = (id) => {
		const person = persons.find((p) => p.id === id);
		if (person && window.confirm(`Delete ${person.name}?`)) {
			personService
				.remove(id)
				.then(() => {
					setPersons(persons.filter((p) => p.id !== id));
					setNotification(`Deleted ${person.name}`);
					setTimeout(() => {
						setNotification(null);
					}, 5000);
				})
				.catch((error) => {
					setError(`Information of ${person.name} has already been removed from server`);
					setTimeout(() => {
						setError(null);
					}, 5000);
					setPersons(persons.filter((p) => p.id !== id)); // Remove from the local state as well
				});
		}
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const personsToShow = search
		? persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
		: persons;

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter search={search} handleSearchChange={handleSearchChange}></Filter>
			<PersonForm
				addPerson={addPerson}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
			<h2>Numbers</h2>
			<Notification message={notification} />
			<ErrorMessage message={error} />

			<Persons personsToShow={personsToShow} onDelete={deletePerson} />
		</div>
	);
};

export default App;
