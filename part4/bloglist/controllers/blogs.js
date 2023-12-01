const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post("", async (request, response) => {
	const { title, author, url } = request.body;
	let { likes } = request.body;

	if (!title || !url) {
		return response.status(400).json({ error: "missing url or title" });
	}

	if (likes === undefined) {
		likes = 0;
	}

	const blog = new Blog({
		title,
		author,
		url,
		likes,
	});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response, next) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.delete("/:id", async (request, response, next) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const id = request.params.id;
	const blogUpdate = request.body;

	const updatedBlog = await Blog.findByIdAndUpdate(id, blogUpdate, { new: true });
	if (updatedBlog) {
		response.json(updatedBlog);
	} else {
		response.status(404).end(); // Not Found if no blog with that ID
	}
});

module.exports = blogsRouter;
