const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});
	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

describe("when there are initially some blogs saved", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("a specific blog is within the returned blogs", async () => {
		const response = await api.get("/api/blogs");
		const titles = response.body.map((r) => r.title);
		expect(titles).toContain(helper.initialBlogs[0].title);
	});

	test("unique identifier property of the blog posts is named id", async () => {
		const response = await api.get("/api/blogs");
		const blogs = response.body;
		expect(blogs[0].id).toBeDefined();
	});
});

describe("addition of a new blog", () => {
	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "Understanding Async/Await",
			author: "Jane Doe",
			url: "http://example.com/async-await",
			likes: 10,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		const titles = blogsAtEnd.map((r) => r.title);

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
		expect(titles).toContain("Understanding Async/Await");
	});

	test("if likes property is missing it defaults to 0", async () => {
		const newBlog = {
			title: "Test Blog Without Likes",
			author: "Tester",
			url: "http://example.com/test-blog-without-likes",
		};

		const response = await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.likes).toBeDefined();
		expect(response.body.likes).toBe(0);
	});

	test("blog without title is not added", async () => {
		const newBlog = {
			author: "Jane Doe",
			url: "http://example.com/no-title",
			likes: 5,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe("viewing a specific blog", () => {
	test("a specific blog can be viewed", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToView = blogsAtStart[0];

		const resultBlog = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(resultBlog.body).toEqual(blogToView);
	});
});

describe("deletion of a blog", () => {
	test("a blog can be deleted", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

		const titles = blogsAtEnd.map((r) => r.title);

		expect(titles).not.toContain(blogToDelete.title);
	});

	test("the number of likes for a blog can be updated", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		const updatedBlog = {
			...blogToUpdate,
			likes: blogToUpdate.likes + 1,
		};

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

		const blogsAtEnd = await helper.blogsInDb();
		const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
		expect(updated.likes).toBe(blogToUpdate.likes + 1);
	});
});

describe("modifying blogs", () => {
	test("the number of likes for a blog can be updated", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		const updatedBlog = {
			...blogToUpdate,
			likes: blogToUpdate.likes + 1,
		};

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

		const blogsAtEnd = await helper.blogsInDb();
		const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
		expect(updated.likes).toBe(blogToUpdate.likes + 1);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
