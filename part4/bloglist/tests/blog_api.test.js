const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

test("there are six blogs", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("the first blog is about Blogs", async () => {
	const response = await api.get("/api/blogs");
	expect(response.body[0].title).toBe(helper.initialBlogs[0].title);
});

test("a specific blog is within the returned blogs", async () => {
	const response = await api.get("/api/blogs");
	const titles = response.body.map((r) => r.title);
	expect(titles).toContain("Blog Title 1");
});

test("blogs are returned as json", async () => {
	await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
}, 100000);

test("a valid blog can be added", async () => {
	const newBlog = {
		title: "Blog Title 7",
		author: "Author 7",
		url: "http://www.blog7.com",
		likes: 7,
	};

	await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	const titles = blogsAtEnd.map((r) => r.title);
	expect(titles).toContain("Blog Title 7");
});

test("blog without title is not added", async () => {
	const newBlog = {
		author: "Author 7",
		url: "http://www.blog7.com",
		likes: 7,
	};

	await api.post("/api/blogs").send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("blog without url is not added", async () => {
	const newBlog = {
		title: "Blog Title 7",
		author: "Author 7",
		likes: 4,
	};

	await api.post("/api/blogs").send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("blog post has id property", async () => {
	const blogPost = new Blog({
		title: "Test Blog Post",
		author: "Test Author",
		url: "http://testurl.com",
		likes: 5,
	});
	const jsonBlogPost = blogPost.toJSON();
	expect(jsonBlogPost.id).toBeDefined();
	expect(jsonBlogPost._id).toBeUndefined();
});

test("blog without likes property defaults to 0", async () => {
	const newBlog = {
		title: "Blog Title 7",
		author: "Author 7",
		url: "http://www.blog7.com",
	};

	response = await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	expect(response.body.likes).toBe(0);
});

test("delete a blog post", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToDelete = blogsAtStart[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
});

test("update a blog post", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToUpdate = blogsAtStart[0];

	const updatedBlog = {
		title: "Updated Blog Title",
	};

	await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

	expect(blogToUpdate.title).not.toBe(updatedBlog.title);
});

afterAll(async () => {
	await mongoose.connection.close();
});
