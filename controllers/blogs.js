const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const {userExtractor} = require('../utils/middleware');

blogsRouter.get('/', async (req, res, next) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
  res.json(blogs);
});

blogsRouter.post('/', userExtractor, async (req, res, next) => {
  const blog = new Blog(req.body);
  blog.user = req.user;
  const savedBlog = await blog.save();
  const user = await User.findById(req.user.id);
  user.blogs.push(savedBlog.id);
  await user.save();
  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  console.log('blog user ID', blog.user.toString());
  console.log('req.user', req.user._id.toString);
  if (req.user._id.toString() !== blog.user.toString()) {
    return res.status(401).json({error:'User not authorized'});
  };
  await blog.deleteOne();
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog
      .findByIdAndUpdate(req.params.id, blog, {runValidators: true, new: true});
  res.json(updatedBlog);
});

module.exports = blogsRouter;
