const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
	{
		title: "Blog Title 1",
		author: "Author 1",
		url: "http://www.blog1.com",
		likes: "3",
	},
	{
		title: "Blog Title 2",
		author: "Author 2",
		url: "http://www.blog2.com",
		likes: 5,
	},
	{
		title: "Blog Title 3",
		author: "Author 3",
		url: "http://www.blog3.com",
		likes: 2,
	},
	{
		title: "Blog Title 4",
		author: "Author 4",
		url: "http://www.blog4.com",
		likes: 1,
	},
	{
		title: "Blog Title 5",
		author: "Author 5",
		url: "http://www.blog5.com",
		likes: 4,
	},
	{
		title: "Blog Title 6",
		author: "Author 6",
		url: "http://www.blog6.com",
		likes: 6,
	},
];

const nonExistingId = async () => {
	const blog = new Blog({ title: "willremovethissoon" });
	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	usersInDb,
};
