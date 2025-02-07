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
    blogs.forEach(blog => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favoriteBlog = blog
        }
    });
    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
