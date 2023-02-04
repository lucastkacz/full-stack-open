import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/api";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [searchName, setSearchName] = useState("");
	const [message, setMessage] = useState(null);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		personService.getPersons().then((response) => {
			setPersons(response.data);
		});
	}, []);

	const personNameFilter = persons.filter((person) =>
		person.name.toLowerCase().includes(searchName.toLowerCase())
	);

	const addPerson = (event) => {
		event.preventDefault();

		const existingPerson = persons.find((person) => person.name === newName);

		if (newName && newNumber) {
			if (existingPerson) {
				if (
					window.confirm(
						`${newName} is already added to phonebook, replace the old number with a new one?`
					)
				) {
					personService
						.updatePerson(existingPerson.id, { ...existingPerson, number: newNumber })
						.then((response) => {
							setPersons(
								persons.map((person) => (person.id === existingPerson.id ? response.data : person))
							);
							setNewName("");
							setNewNumber("");
						})
						.catch((error) => {
							setStatus("error");
							setMessage(
								`Information of ${existingPerson.name} has already been removed from server`
							);
							setTimeout(() => {
								setStatus(null);
								setMessage(null);
							}, 5000);

							setPersons(persons.filter((person) => person.id !== existingPerson.id));
						});

					setMessage(`Updated ${newName}'s number`);
					setTimeout(() => {
						setMessage(null);
					}, 5000);
				}
			} else {
				const personObject = {
					id: persons.length + 1,
					name: newName,
					number: newNumber,
				};

				setStatus("success");
				personService.createPerson(personObject).then((response) => {
					setPersons(persons.concat(response.data));
					setNewName("");
					setNewNumber("");
				});

				setMessage(`Added ${newName}`);
				setTimeout(() => {
					setStatus(null);
					setMessage(null);
				}, 5000);
			}
		}
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleSearchChange = (event) => {
		setSearchName(event.target.value);
	};

	const handleDelete = (id) => {
		if (window.confirm("Delete this person?")) {
			personService.deletePerson(id).then(() => {
				setPersons(persons.filter((person) => person.id !== id));
			});
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} status={status} />
			<Filter searchName={searchName} handleSearchChange={handleSearchChange} />
			<h2>Add a new</h2>
			<PersonForm
				newName={newName}
				newNumber={newNumber}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
				addPerson={addPerson}
			></PersonForm>
			<h2>Numbers</h2>
			<Persons persons={personNameFilter} handleDelete={handleDelete}></Persons>
		</div>
	);
};

export default App;
