const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes;
	};

	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	let maxLikes = 0;
	let topBlog = null;

	blogs.forEach((blog) => {
		if (blog.likes > maxLikes) {
			maxLikes = blog.likes;
			topBlog = blog;
		}
	});

	return topBlog
		? {
				title: topBlog.title,
				author: topBlog.author,
				likes: topBlog.likes,
		  }
		: 0;
};

const mostBlogs = (blogs) => {
	const authors = {};
	let maxBlogs = 0;
	let maxAuthor = null;

	blogs.forEach((blog) => {
		if (authors[blog.author]) {
			authors[blog.author] += 1;
		} else {
			authors[blog.author] = 1;
		}

		if (authors[blog.author] > maxBlogs) {
			maxBlogs = authors[blog.author];
			maxAuthor = blog.author;
		}
	});

	return maxAuthor ? { author: maxAuthor, blogs: maxBlogs } : 0;
};

const mostLikes = (blogs) => {
	const authors = {};
	let maxLikes = 0;
	let maxAuthor = null;

	blogs.forEach((blog) => {
		if (authors[blog.author]) {
			authors[blog.author] += blog.likes;
		} else {
			authors[blog.author] = blog.likes;
		}

		if (authors[blog.author] > maxLikes) {
			maxLikes = authors[blog.author];
			maxAuthor = blog.author;
		}
	});

	return maxAuthor ? { author: maxAuthor, likes: maxLikes } : 0;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
