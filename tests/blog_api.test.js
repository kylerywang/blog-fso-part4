const mongoose = require('mongoose');
const supertest=require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.listWithSixBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('all blogs are returned', async ()=>{
  const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type',/application\/json/);

  expect(response.body).toHaveLength(helper.listWithSixBlogs.length);
});

test('blog.id exists', async () => {
  const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

  expect(response.body[0].id.toBeDefined);
});

test('HTTP POST creates a new blog post', async () => {
  await api
      .post('/api/blogs/')
      .send(helper.listWithOneBlog[0])
      .expect(201)
      .expect('Content-Type', /application\/json/);

  notesAtEnd = await helper.blogsinDB();
  expect(notesAtEnd).toHaveLength(helper.listWithSixBlogs.length + 1);
});

test('if likes is missing from request default to 0', async()=>{
  const blog = {
    title: 'Harry Potter and the Chocolate Factory',
    author: 'Kyler Wang',
    url: 'https://google.com/',
  };

  response = await api
      .post('/api/blogs/')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  notesAtEnd = await helper.blogsinDB();

  expect(notesAtEnd[notesAtEnd.length-1].likes.toBeDefined);
});

test('respond 400 bad request if title missing', async ()=>{
  const blog = {
    author: 'Kyler Wang',
    url: 'https://google.com/',
    likes: '5',
  };

  response = await api
      .post('/api/blogs/')
      .send(blog)
      .expect(400);
});

test('respond 400 bad request if url missing', async ()=>{
  const blog = {
    title: 'Harry Potter and the Chocolate Factory',
    author: 'Kyler Wang',
    likes: '5',
  };

  response = await api
      .post('/api/blogs/')
      .send(blog)
      .expect(400);
});

test('succesfully delete a blog from id', async () => {
  const blogsAtBeginning = await helper.blogsinDB();
  const blogId = blogsAtBeginning[0].id;
  response = await api
      .delete(`/api/blogs/${blogId}/`)
      .expect(204);
  const blogsAtEnd = await helper.blogsinDB();
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length - 1);
});

test('successfully update a blog from id', async () =>{
  const blogsAtBeginning = await helper.blogsinDB();
  const blogId = blogsAtBeginning[0].id;
  const newBlog = {
    title: 'Harry Potter and the Chocolate Factory',
    author: 'Kyler Wang',
    url: 'https://google.com/',
  };
  const response = await api
      .put(`/api/blogs/${blogId}/`)
      .send(newBlog)
      .expect(200);
  const blogInDB = await Blog.findById(blogId);
  console.log(blogInDB);

  expect(blogInDB.title).toBe(newBlog.title);
  expect(blogInDB.author).toBe(newBlog.author);
  expect(blogInDB.url).toBe(newBlog.url);
});

afterAll(async () => {
  await mongoose.connection.close();
});
