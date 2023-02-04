import axios from "axios";

const baseURL = "http://localhost:3001/persons";

const getPersons = () => {
	return axios.get(baseURL);
};

const createPerson = (newPerson) => {
	return axios.post(baseURL, newPerson);
};

const deletePerson = (id) => {
	return axios.delete(`${baseURL}/${id}`);
};

const updatePerson = (id, newPerson) => {
	return axios.put(`${baseURL}/${id}`, newPerson);
};

const api = { getPersons, createPerson, deletePerson, updatePerson };

export default api;
