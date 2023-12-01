const Persons = ({ personsToShow, onDelete }) => {
	return (
		<ul>
			{personsToShow.map((person) => (
				<li key={person.id} className="person">
					{person.name} {person.number}
					<button onClick={() => onDelete(person.id)}>Delete</button>
				</li>
			))}
		</ul>
	);
};

export default Persons;
