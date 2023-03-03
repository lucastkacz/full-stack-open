const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
	const body = request.body;
	const user = request.user;

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "Missing title or URL" });
	}

	const blog = new Blog({
		title: body.title,
		author: body.author || "",
		url: body.url,
		likes: body.likes || 0,
		user: user._id,
	});

	const savedBlog = await blog.save();

	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
	response.status(201).json(savedBlog.toJSON());
});

blogsRouter.put("/:id", async (request, response) => {
	const { title, author, url, likes } = request.body;

	const blog = {
		title,
		author,
		url,
		likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });

	if (!updatedBlog) {
		return response.status(404).json({ error: "Blog not found" });
	}
	response.json(updatedBlog.toJSON());
});

blogsRouter.delete("/:id", async (request, response) => {
	// Check if user exists before proceeding
	if (!request.user) {
		return response.status(401).json({ error: "You are not authorized to delete this blog" });
	}

	const blog = await Blog.findById(request.params.id);

	if (!blog) {
		return response.status(404).json({ error: "Blog not found" });
	}

	if (blog.user.toString() !== request.user._id.toString()) {
		return response.status(401).json({ error: "You are not authorized to delete this blog" });
	}

	await blog.remove();
	response.status(204).end();
});

module.exports = blogsRouter;
