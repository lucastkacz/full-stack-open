require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response, next) => {
	const date = new Date();

	Person.countDocuments()
		.then((entriesCount) => {
			const responseContent = `
                <p>Phonebook has info for ${entriesCount} people</p>
                <p>${date}</p>
            `;
			response.send(responseContent);
		})
		.catch((error) => next(error));
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((notes) => {
		response.json(notes);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).send({ error: "Person not found" });
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({ error: "name or number is missing" });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	const updatedPerson = { number };

	Person.findByIdAndUpdate(request.params.id, updatedPerson, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedPerson) => {
			if (updatedPerson) {
				response.json(updatedPerson);
			} else {
				response.status(404).send({ error: "Person not found" });
			}
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	} else if (error.name === "MongoServerError") {
		return response.status(500).json({ error: "MongoDB server error" });
	}

	next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
