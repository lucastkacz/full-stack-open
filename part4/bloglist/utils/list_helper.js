const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return null;

	const favorite = blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog));

	return {
		title: favorite.title,
		author: favorite.author,
		likes: favorite.likes,
	};
};

const mostBlogs = (blogs) => {
	const authorBlogCounts = {};

	blogs.forEach((blog) => {
		if (!authorBlogCounts[blog.author]) {
			authorBlogCounts[blog.author] = 0;
		}
		authorBlogCounts[blog.author] += 1;
	});

	let maxBlogs = 0;
	let maxAuthor = null;

	for (const author in authorBlogCounts) {
		if (authorBlogCounts[author] > maxBlogs) {
			maxBlogs = authorBlogCounts[author];
			maxAuthor = author;
		}
	}

	if (maxAuthor === null) {
		return null;
	}

	return {
		author: maxAuthor,
		blogs: maxBlogs,
	};
};

const mostLikes = (blogs) => {
	const authorLikes = {};

	blogs.forEach((blog) => {
		if (!authorLikes[blog.author]) {
			authorLikes[blog.author] = 0;
		}
		authorLikes[blog.author] += blog.likes;
	});

	let maxLikes = 0;
	let maxAuthor = null;

	for (const author in authorLikes) {
		if (authorLikes[author] > maxLikes) {
			maxLikes = authorLikes[author];
			maxAuthor = author;
		}
	}

	if (maxAuthor === null) {
		return null;
	}

	return {
		author: maxAuthor,
		likes: maxLikes,
	};
};

module.exports = {
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
