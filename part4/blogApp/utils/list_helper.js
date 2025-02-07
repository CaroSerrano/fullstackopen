const blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } else {
    const reducer = (sum, item) => {
      return sum + item;
    };
    const likes = blogs.map((b) => b.likes);
    return likes.reduce(reducer, 0);
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  } else {
    let maxLikes = 0;
    let favoriteBlog;
    blogs.forEach((blog) => {
      if (blog.likes > maxLikes) {
        maxLikes = blog.likes;
        favoriteBlog = blog;
      }
    });
    return {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes,
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthor = Object.groupBy(blogs, ({ author }) => author);

  let authorWithMostBlogs;
  let mostBlogs = 0;
  for (const [index, element] of Object.entries(blogsByAuthor)) {
    if (element.length > mostBlogs) {
      authorWithMostBlogs = index;
      mostBlogs = element.length;
    }
  }
  return {
    author: authorWithMostBlogs,
    blogs: mostBlogs,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
