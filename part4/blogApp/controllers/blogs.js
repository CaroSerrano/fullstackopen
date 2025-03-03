const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (user && body.title && body.url) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      comments: body.comments || [],
      user: user.id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } else {
    response.status(400).end();
  }
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(request.params.id);
  if (body.comments) {
    blog.comments.push(body.comments)
    await blog.save()
    response.status(201).json(blog);
  } else {
    response.status(400).send('Please provide body.comments');
  }
});


blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    const userId = request.user.id;
    if (!blog.user) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    }
    if (blog.user.toString() === userId.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(403).json({
        error: 'You do not have sufficient permissions to delete the resource',
      });
    }
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: body.user,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
