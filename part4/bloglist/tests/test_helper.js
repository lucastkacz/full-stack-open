const Blog = require("../models/blog");

const initialBlogs = [
	{
		title: "Blog about JavaScript",
		author: "John Doe",
		url: "http://example.com/javascript",
		likes: 7,
	},
	{
		title: "Blog about Python",
		author: "Jane Doe",
		url: "http://example.com/python",
		likes: 5,
	},
];

const nonExistingId = async () => {
	const blog = new Blog({ title: "Temporary Blog", url: "http://example.com/temp" });
	await blog.save();
	await blog.deleteOne();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
};
