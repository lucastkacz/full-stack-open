import React from "react";

const Persons = ({ persons, handleDelete }) => {
	return (
		<div>
			{persons.map((person) => {
				return (
					<div key={person.id}>
						<p>
							<strong>{person.name}: </strong>
							{person.number}
							<button onClick={() => handleDelete(person.id)}>Delete</button>
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default Persons;
