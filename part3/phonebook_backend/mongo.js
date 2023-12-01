const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
const dbName = "phonebook";

const url = `mongodb+srv://lucastkacz:${password}@fullstackopen.87knmiy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
	// Display all entries in the phonebook
	Person.find({}).then((result) => {
		console.log("phonebook:");
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
} else if (process.argv.length === 5) {
	// Add new entry to the phonebook
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then(() => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
}
